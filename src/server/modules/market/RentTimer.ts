export class RentTimer {
    public timeEndHandler: () => void

    public constructor(
        private rentTime: number
    ) {
        timersPool.push({
            timer: this,
            destroyHandler: this.destroyByTime.bind(this),
            decreaseTickHandler: this.decreaseTick.bind(this)
        });
    }

    public get timeLeftS() {
        return this.rentTime;
    }

    public getMaxExpandTime(): number {
        return 0;
    }

    public expandTime(addTimeS: number) {
        this.rentTime += addTimeS;
    }

    public destroy() {
        const idx = timersPool.findIndex(obj => obj.timer === this);
        if (idx === -1) {
            return;
        }

        timersPool.splice(idx);
    }

    private decreaseTick() {
        this.rentTime--;
    }

    private destroyByTime() {
        if (this.timeEndHandler) {
            this.timeEndHandler();
        }

        this.destroy();
    }
}

const timersPool: { timer: RentTimer, destroyHandler: () => void, decreaseTickHandler: () => void }[] = [];

function rentTick() {
    timersPool.forEach(obj => {
        obj.decreaseTickHandler();

        if (obj.timer.timeLeftS <= 0) {
            obj.destroyHandler();
        }
    })
}

setInterval(rentTick, 1000);