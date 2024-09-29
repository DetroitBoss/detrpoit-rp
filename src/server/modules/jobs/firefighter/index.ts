import {FireStation} from "./FireStation";
import {FIRE_STATIONS} from "./config";
import './dispatcher';

FIRE_STATIONS.forEach(parameters => new FireStation(parameters));
