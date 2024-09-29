let block = false;
export const needCasinoExit = () => {
    if(block) return false;
    const status = mp.game.controls.isDisabledControlJustReleased(2, 200) || mp.players.local.isDead() || mp.players.local.getHealth() <= 0;
    if(status){
        block = true;
        setTimeout(() => {
            block = false
        }, 5000)
    }
    return status
}