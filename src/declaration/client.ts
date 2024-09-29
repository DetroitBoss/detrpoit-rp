/// <reference path="rage-client.ts" />


declare interface Vector2 {
  x:number,
  y:number
}

declare interface EventMpPool {
  add(eventName: "render", callback: (nametags?: [PlayerMp, number, number, number][]) => void): void;
  add(eventName: "incomingDamage", callback: (sourceEntity: PlayerMp | null, sourcePlayer: EntityMp, targetEntity: PedMp | PlayerMp, weapon: number, boneIndex: number, damage: number) => void): any;
  add(eventName: "outgoingDamage", callback: (sourceEntity: PlayerMp | null, targetEntity: PedMp | PlayerMp, sourcePlayer: PlayerMp, weapon: number, boneIndex: number, damage: number) => void): any;
  add(eventName: "renderHalf", callback: (nametags?: [PlayerMp, number, number, number][]) => void): void;
}

interface PlayerClient extends EntityMp {
  lastReceivedPointing: number;
  pointingInterval: number;
  skate: {
    obj?:ObjectMp;
    objveh?:VehicleMp;
    objped?:PedMp;
  }
  playAnims: (seq: [string, string, number?][], upper?: boolean, lopping?:boolean) => Promise<any>
}

interface VehicleMp {
  lastLockedTime: number;
  radio: number;
  autosalon: boolean;
  staticVehicle: number;
}

interface ClientBrowserMp {
  executeAll(code: string[]): void;
}
