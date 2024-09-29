import { CallType } from "../enums/callType.enum";
import { Contact } from "./contact.interface";

export interface Call extends Contact {
  type: CallType;
  time: Date;
  quantityCalls?: number;
}
