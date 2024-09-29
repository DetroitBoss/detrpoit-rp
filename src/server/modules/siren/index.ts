import {ISirenPlace} from "../../../shared/siren/ISirenPlace";
import {Siren} from "./Siren";
import {SIREN_PLACES} from "../../../shared/siren/config";

SIREN_PLACES.forEach(el => {
    new Siren(el)
})