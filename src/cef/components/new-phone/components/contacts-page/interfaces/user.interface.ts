import { CallType } from "./../enums/callType.enum";
export interface User {
  phone: number;
  photo?: string;
  name: string;
  calls?: { time: string; type: CallType; duration?: string }[];
  familiar?: boolean;
}
