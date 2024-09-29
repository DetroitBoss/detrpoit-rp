export interface ISeller {
    destroy(isTentDestroyed: boolean): void;

    makePayment(money: number): void;

    getSellsPercent(): number;

    callToTent(caller: PlayerMp): void;
}