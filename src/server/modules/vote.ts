import {VOTE_POS} from "../../shared/vote";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {VoteEntity, VoteList} from "./typeorm/entities/vote";
import {system} from "./system";

let votes = new Map<number, VoteEntity>();


export const loadAllVotes = () => {
    return new Promise(resolve => {
        VoteEntity.find().then(items => {
            items.map(item => {
                votes.set(item.id, item)
            })
            resolve(null)
        })
    })
}

colshapes.new(VOTE_POS, 'Центр голосования', (player) => {
    const user = player.user;
    if(!user) return;
    if(user.level < LEVEL_PERMISSIONS.VOTE) return player.notify(`Голосовать можно только с ${LEVEL_PERMISSIONS.VOTE} уровня`, 'error');
    const m = menu.new(player, 'Центр голосования');



    if([...votes].length > 0) m.newItem({name: '~b~Список голосований'})
    else m.newItem({name: 'Сейчас не проходит никаких голосований'});

    votes.forEach(item => {
        m.newItem({
            name: item.name,
            more: `${item.end < system.timestamp ? 'Завершено' : `До ${system.timeStampString(item.end)}`}`,
            desc: `Голосование начато ${system.timeStampString(item.start)}`,
            onpress: () => {
                openVote(player, item);
            }
        })
    })

    if(user.hasPermission('admin:vote')){

        m.newItem({
            name: '~b~Создать голосование',
            onpress: () => {

                let name: string;
                let variants: string[] = [];
                let hours = 24;

                const z = () => {
                    const s = menu.new(player, 'Создание голосования');
                    s.newItem({
                        name: 'Название',
                        more: name || "Необходимо указать",
                        onpress: () => {
                            menu.input(player, 'Введите название', name || "", 30, 'text').then(n => {
                                if(!n) return;
                                name = n;
                                z();
                            })
                        }
                    })
                    s.newItem({
                        name: 'Сколько часов будет идти',
                        more: hours,
                        desc: `До ${system.timeStampString(system.timestamp + (hours * 60 * 60))} если запустить сейчас`,
                        onpress: () => {
                            menu.input(player, 'Введите количество часов', hours, 10, 'int').then(n => {
                                if(!n) return;
                                if(isNaN(n) || n < 0 || n > 10000) return;
                                hours = n;
                                z();
                            })
                        }
                    })
                    s.newItem({
                        name: 'Добавить вариант',
                        onpress: () => {
                            menu.input(player, 'Введите вариант', "", 20, 'text').then(n => {
                                if(!n) return;
                                if(variants.includes(n)) return player.notify('Такой вариант уже добавлен', 'error');
                                variants.push(n);
                                z();
                            })
                        }
                    })
                    variants.map((variant, i) => {
                        s.newItem({
                            name: variant,
                            onpress: () => {
                                variants.splice(i, 1)
                                player.notify('Вариант удалён', 'error')
                                z();
                            }
                        })
                    })
                    s.newItem({
                        name: '~b~Запустить',
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if(!status) return;
                                if(!name) return player.notify('Укажите название', 'error')
                                if(variants.length < 2) return player.notify('Укажите как минимум 2 варианта', 'error')
                                menu.close(player)
                                let vote = new VoteEntity()
                                vote.name = name;
                                vote.closed = 0;
                                vote.start = system.timestamp
                                vote.end = vote.start + (hours * 60 * 60)
                                vote.variants = variants;
                                vote.variants_res = new Array(variants.length).fill(0)
                                vote.save().then(itm => {
                                    votes.set(itm.id, itm);
                                    player.notify('Голосование запущено', 'success');
                                })
                            })
                        }
                    })
                    s.open()
                }

                z();
            }
        })

    }

    m.open();
}, {
    type: 27,
    drawStaticName: "scaleform"
})

const openVote = (player: PlayerMp, item: VoteEntity) => {
    const user = player.user;
    if(!user) return;
    if(user.level < LEVEL_PERMISSIONS.VOTE) return player.notify(`Голосовать можно только с ${LEVEL_PERMISSIONS.VOTE} уровня`, 'error');
    VoteList.findOne({
        where: {
            user: user.id,
            vote: item.id
        }
    }).then(myvote => {
        const m = menu.new(player, 'Центр голосования', item.name);

        m.newItem({
            name: `Начало голосования`,
            more: system.timeStampString(item.start)
        })
        m.newItem({
            name: `Окончание голосования`,
            more: system.timeStampString(item.end)
        })
        m.newItem({
            name: "Статус",
            more: (item.closed ? 'Завершено досрочно' : (item.end < system.timestamp ? 'Завершено' : `Активно`))
        })
        const canVote = !item.closed && item.end > system.timestamp && !myvote;
        if(canVote){
            item.variants.map((variant, index) => {
                m.newItem({
                    name: `Отдать голос за ${variant}`,
                    onpress: () => {
                        menu.close(player)
                        menu.accept(player, `Вы точно хотите отдать свой голос за ${variant}`).then(status => {
                            if(!status) return openVote(player, item);
                            VoteList.findOne({
                                where: {
                                    user: user.id,
                                    vote: item.id
                                }
                            }).then(status => {
                                if(status) return player.notify('Вы уже отдали свой голос', 'error'), openVote(player, item);
                                let newVote = new VoteList();
                                newVote.user = user.id;
                                newVote.name = user.name;
                                newVote.vote = item.id;
                                newVote.variant = index;
                                newVote.save().then(() => {
                                    player.notify('Вы успешно отдали свой голос')
                                    const q = [...item.variants_res]
                                    q[index]++;
                                    item.variants_res = q;
                                    openVote(player, item);
                                    item.save();
                                })
                            })
                        })
                    }
                })
            })
        } else if(myvote){
            m.newItem({
                name: `Мой голос`,
                more: item.variants[myvote.variant]
            })
        }

        m.newItem({
            name: !item.closed && item.end > system.timestamp ? 'Предварительные результаты' : 'Итоговые результаты'
        })

        item.variants.map((name, index) => {
            m.newItem({
                name: name,
                more: item.variants_res[index]
            })
        })

        if(user.hasPermission('admin:vote')){
            m.newItem({
                name: (item.closed ? 'Открыть' : 'Закрыть')+' голосование',
                desc: 'Не повлияет если срок голосования истёк',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        item.closed = item.closed === 1 ? 0 : 1
                        item.save().then(() => {
                            openVote(player, item);
                        })
                    })
                }
            })

            m.newItem({
                name: '~r~Удалить голосование',
                desc: 'Необратимо удалит и голосование и результат. Используйте для старых голосований, результат которых уже не нужен',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        menu.close(player)
                        votes.delete(item.id);
                        item.remove()
                        VoteList.find({vote: item.id}).then(list => VoteList.remove(list))
                        player.notify('Голосование удалено', 'success')
                    })
                }
            })
        }

        m.open();
    })

}