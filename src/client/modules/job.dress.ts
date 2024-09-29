import {CustomEvent} from "./custom.event";
import {DialogInput, MenuClass} from "./menu";
import {
    generateClothData,
    getComponent,
    oldClothData,
    resetCloth,
    resetClothData,
    setComponent,
    undress
} from "./cloth";
import {user} from "./user";
import {system} from "./system";
const player = mp.players.local;

let components = [107, 106, 102, 101, 100, 7, 1, 6, 4, 3, 8, 11];

const getCurrent = (): [number, number, number][] => {
    return components.map(component => [component, getComponent(component).drawable, getComponent(component).texture])
}



CustomEvent.registerServer('jobdress:edit', (id:number, index?:number, data?: [number, number, number][], name?:string) => {
    if (oldClothData.length == 0) generateClothData();
    // resetCloth();
    undress()
    if(data) data.map(item => setComponent(item[0], item[1], item[2]));

    const pos = {...player.position}



    let int = setInterval(() => {
        if(system.distanceToPos(player.position, pos) > 5){
            close();
        }
    }, 1000)

    const close = () => {
        resetCloth();
        resetClothData();
        clearInterval(int)
        CustomEvent.triggerServer('job:dress:clear')
        MenuClass.closeMenu()
    }

    const q = (z = 0) => {

        let m = new MenuClass("", typeof index === 'number' ? 'Редактирование одежды' : "Добавление одежды");
        m.onclose = () => {
            close();
        }
        m.exitProtect = true;

        m.newItem({
            name: 'Название',
            more: name,
            onpress: (_, i) => {
                DialogInput(`Введите значение`, name || '', 10).then(val => {
                    if(!val) return;
                    name = system.filterInput(val);
                    q(i);
                })
            }
        })

        getCurrent().map((item, i) => {
            m.newItem({name: '--------------'})
            m.newItem({
                name: 'Компонент',
                more: item[0],
            })
            m.newItem({
                name: 'Вид',
                type: 'range',
                rangeselect: [-1, 9999],
                listSelected: item[1] + 1,
                onchange: (val) => {
                    item[1] = val - 1;
                    setComponent(item[0], item[1], item[2]);
                },
                onpress: (_, i) => {
                    DialogInput(`Введите значение`, item[1], 4, 'int').then(val => {
                        if(typeof val !== 'number') return;
                        item[1] = val;
                        setComponent(item[0], item[1], item[2]);
                        q(i);
                    })
                }
            })
            m.newItem({
                name: 'Текстура',
                type: 'range',
                rangeselect: [-1, 9999],
                listSelected: item[2] + 1,
                onchange: (val) => {
                    item[2] = val - 1;
                    setComponent(item[0], item[1], item[2]);
                },
                onpress: (_, i) => {
                    DialogInput(`Введите значение`, item[1], 4, 'int').then(val => {
                        if(typeof val !== 'number') return;
                        item[2] = val;
                        setComponent(item[0], item[1], item[2]);
                        q(i);
                    })
                }
            })
        })

        m.newItem({
            name: 'Сохранить',
            onpress: () => {
                if(!name) return user.notify("Необходимо указать название", 'error')
                const current = getCurrent();
                close();
                CustomEvent.triggerServer('job:dress:save', id, index, current, name)

            }
        })

        m.open(z);
    }
    q();

})