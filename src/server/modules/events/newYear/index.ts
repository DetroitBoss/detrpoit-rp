import {Snowballs} from './snowballs';
import {EVENT_IS_ACTIVE} from "../../../../shared/events/newYear/main.config";
import {greeting} from "./greeting";
import {Presents} from "./presents";
import {adminPanel} from "./adminPanel";
import {Exchange} from "./exchange";
import {quests} from "./quests";
import {SpawnSantaNPC} from "./npc/santa-claus";
import {createNewYearBlip} from "./blip";
import {SpawnHarryNPC} from "./npc/harry";
import {SpawnWordNPC} from "./npc/word";
import {SpawnMarvNPC} from "./npc/marv";
import {SpawnAbelardoNPC} from "./npc/abelardo";
import {SpawnSecurityNPC} from "./npc/security";
import {SpawnMegatronNPC} from "./npc/megatron";
import {SpawnGalileoNPC} from "./npc/galileo";
import {SpawnArielNPC} from "./npc/ariel";
import "./userGifts";


if (EVENT_IS_ACTIVE) {
    new Exchange();
    new Snowballs();
    const PresentsEvent = new Presents();

    greeting();
    adminPanel(PresentsEvent);
    createNewYearBlip();

    // Квесты

    quests();
    SpawnSantaNPC();
    SpawnHarryNPC();
    SpawnWordNPC();
    SpawnMarvNPC();
    SpawnAbelardoNPC();
    SpawnSecurityNPC();
    SpawnMegatronNPC();
    SpawnGalileoNPC();
    SpawnArielNPC();
}