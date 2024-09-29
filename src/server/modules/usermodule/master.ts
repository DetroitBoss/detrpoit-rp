import {User} from "../user";
import {ACHIEVEMENT_LIST} from "../../../shared/achievements";

export class UserAddonClass {
    user: User
    get entity(){
        return this.user.entity
    }
    get player(){
        return this.user.player
    }
    get id(){
        return this.user.id
    }
    get name(){
        return this.user.name
    }
    get exists(){
        return this.user.exists
    }
    get getNearestPlayers(){
        return this.user.getNearestPlayers
    }
    get notify(){
        return this.user.notify
    }
    get haveItem(){
        return this.user.haveItem
    }
    get getArrayItem(){
        return this.user.getArrayItem
    }
    get bank_have(){
        return this.user.bank_have
    }
    get getLicense(){
        return this.user.getLicense
    }
    get haveActiveLicense(){
        return this.user.haveActiveLicense
    }
    get giveExp(){
        return this.user.giveExp
    }
    get addMoney(){
        return this.user.addMoney
    }
    get addBankMoney(){
        return this.user.addBankMoney
    }
    get giveItem(){
        return this.user.giveItem
    }
    get giveLicense(){
        return this.user.giveLicense
    }
    get save(){
        return this.user.save
    }
    get mp_character(){
        return this.user.mp_character
    }
    get inventory(){
        return this.user.inventory
    }
    get allMyItems(){
        return this.user.allMyItems
    }
    get sync_bag(){
        return this.user.sync_bag
    }
    get dead(){
        return this.user.dead
    }
    get dropPos(){
        return this.user.dropPos
    }
    get attachList(){
        return this.user.attachList
    }
    set attachList(data){
        this.user.attachList = data
    }
    constructor(user: User) {
        this.user = user;
    }
}