import {getDocumentName} from "../../shared/documents";
import {DOCUMENT_GIVE_POSITIONS} from "../../shared/documents.pos";
import {LicenseName} from "../../shared/licence";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {DialogInput, MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {getBaseItemNameById} from "../../shared/inventory";


DOCUMENT_GIVE_POSITIONS.map((item, id) => {
    colshapes.new(item.pos, item.name, player => {
        if(user.fraction !== item.fraction) return user.notify('У вас нет доступа', "error");
        if(user.rank < item.rank) return user.notify(`Доступно с ${item.rank} ранга`, "error");
        const m = new MenuClass(item.name, 'Список документов');

        if(item.documents){
            item.documents.map((doc, ids) => {
                m.newItem({
                    name: getDocumentName(doc.id),
                    more: `Стоимость: $${system.numberFormat(doc.cost)}`,
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput('Введите ID игрока, которому выдаем документ', null, 5, 'int').then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer('document:pos:get', id, 'doc', ids, val)
                        })
                    }
                })
            })
        }
        if(item.license){
            item.license.map((doc, ids) => {
                m.newItem({
                    name: LicenseName[doc.id],
                    more: `Стоимость: $${system.numberFormat(doc.cost)}. Выдаётся на ${doc.days} дней`,
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput('Введите ID игрока, которому выдаем лицензию', null, 5, 'int').then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer('document:pos:get', id, 'lic', ids, val)
                        })
                    }
                })
            })
        }
        if(item.items){
            item.items.map((item, ids) => {
                m.newItem({
                    name: getBaseItemNameById(item.id),
                    more: `Стоимость: $${system.numberFormat(item.cost)}`,
                    onpress: () => {
                        MenuClass.closeMenu()
                        DialogInput('Введите ID игрока, которому выдаем предмет', null, 5, 'int').then(val => {
                            if(!val || isNaN(val) || val <= 0) return;
                            CustomEvent.triggerServer('document:pos:get', id, 'item', ids, val)
                        })
                    }
                })
            })
        }

        m.open();
    }, {
        radius: MARKERS_SETTINGS.DOCUMENT_GIVE.r,
        color: MARKERS_SETTINGS.DOCUMENT_GIVE.color
    })
})