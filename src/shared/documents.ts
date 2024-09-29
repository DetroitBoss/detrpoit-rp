import { systemUtil } from "./system";

/** Список тегов
 * @id ID игрока, которому он выдан,
 * @name RP Имя игрока
 * @social Social Number игрока (номер ID карты)
 * @idCreator ID игрока, который выдал,
 * @nameCreator RP Имя игрока, который выдал
 * @socialCreator Social Number игрока (номер ID карты), который выдал
 * @code Уникальный длинный код, который у каждого документа свой
 * @date Полная дата
 * @n - Использовать для переноса текста
 * 
 */


export type DocumentId = "weapon_theory" | "mental_examination_ok" | "mental_examination_middle" | "mental_examination_fail" | "phisical_examination_ok"
export const getDocumentName = (id: DocumentId) => {
    const i = document_templates.find(q => q.id === id)
    return i ? i.typeShort : null
}
export const document_templates: {
    /** Уникальный ID для каждого документа */
    id: DocumentId,
    /** Короткая строка для дополнения к названию предмета в инвентаре */
    typeShort: string,
    /** Заголовок просматриваемого документа */
    title: string,
    /** Текст просматриваемого документа */
    text: string
}[] = [
        { id: "weapon_theory", typeShort: "Справка о допуске к экзамену на лицензию на оружие", title: `Справка о прохождении теоретического экзамена на получение лицензии на оружие`, text: `Данная справка выдана гражданину @name (ID Карта @social) сотрудником LSPD @nameCreator (ID Карта @socialCreator) и подтверждает, что вышеупомянутый гражданин обладает достаточными теоретическими знаниями чтобы быть допущеным к практической части экзамена на получение лицензии на ношение и хранение оружия.@n @n Дата выдачи справки: @date.@n @n Уникальный код справки в базе данных: @code` },
        { id: "mental_examination_ok", typeShort: "Справка о результатах психического обследования (Положительная)", title: `Справка о результатах психического обследования`, text: `Данная справка выдана гражданину @name (ID Карта @social) сотрудником медицинской службы @nameCreator (ID Карта @socialCreator) и подтверждает, что вышеупомянутый гражданин прошёл психиатрическое освидетельствование и признан вменяемым.@n @n Дата выдачи справки: @date.@n @n Уникальный код справки в базе данных: @code` },
        { id: "mental_examination_middle", typeShort: "Справка о результатах психического обследования (Средняя)", title: `Справка о результатах психического обследования`, text: `Данная справка выдана гражданину @name (ID Карта @social) сотрудником медицинской службы @nameCreator (ID Карта @socialCreator) и подтверждает, что вышеупомянутый гражданин прошёл психиатрическое освидетельствование и признан вменяемым с некоторыми ограничениями.@n @n Дата выдачи справки: @date.@n @n Уникальный код справки в базе данных: @code` },
        { id: "mental_examination_fail", typeShort: "Справка о результатах психического обследования (Средняя)", title: `Справка о результатах психического обследования`, text: `Данная справка выдана гражданину @name (ID Карта @social) сотрудником медицинской службы @nameCreator (ID Карта @socialCreator) и подтверждает, что вышеупомянутый гражданин прошёл психиатрическое освидетельствование и признан недееспособным.@n @n Дата выдачи справки: @date.@n @n Уникальный код справки в базе данных: @code` },

        { id: "phisical_examination_ok", typeShort: "Справка о результатах физического здоровья (Удовлетворительно)", title: `Справка о результатах физического здоровья`, text: `Данная справка выдана гражданину @name (ID Карта @social) сотрудником медицинской службы @nameCreator (ID Карта @socialCreator) и подтверждает, что вышеупомянутый гражданин прошёл физическое освидетельствование и признан дееспособным.@n @n Дата выдачи справки: @date.@n @n Уникальный код справки в базе данных: @code` },
    ]

const fakeStringCheck = ['a', 'o', 'w', 'j', 'i', 'o', 'v', 'y', 'u', 'l']
const fakeStringReplace = ['o', 'a', 'v', 'l', 'l', 'a', 'y', 'u', 'v', 'i']

export const getFakeSignText = (text: string) => {
    let res:string[] = [];
    text.split('').map(q => {
        const indx = fakeStringCheck.findIndex(s => s === q);
        if(indx > -1){
            q = q.replace(q, fakeStringReplace[indx])
        }
        res.push(q);
    })
    return res.join('')
}

export const getDocumentData = (document: string, date: string, code: string, id: string, name: string, social: string, idCreator: string, nameCreator: string, socialCreator: string, realStr: string) => {
    const replace = (text: string) => {
        text = text.replace(/@date/g, systemUtil.timeStampString(parseInt(date), true) || "не указано");
        text = text.replace(/@code/g, code || "не указано");
        text = text.replace(/@idCreator/g, idCreator || "не указано");
        text = text.replace(/@nameCreator/g, nameCreator || "не указано");
        text = text.replace(/@socialCreator/g, socialCreator || "не указано");
        text = text.replace(/@id/g, id || "не указано");
        text = text.replace(/@name/g, name || "не указано");
        text = text.replace(/@social/g, social || "не указано");
        return text
    }
    const cfg = document_templates.find(q => q.id === document);
    if (!cfg) return null;
    let title = replace(cfg.title)
    let text = replace(cfg.text)
    return { title, text, real: realStr === "true" }
}