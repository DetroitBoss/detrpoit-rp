export const runCasinoAchievWin = (player: PlayerMp, type: 'Roulette' | 'Dice' | 'DiceDealer' | 'Slots', sum: number) => {
    const user = player.user;
    if(!user) return;
    if(type !== "DiceDealer"){
        user.achiev.achievTickByType('casinoWinCount', 1);
        user.achiev.achievTickByType('casinoWinSum', sum);
    }
    user.achiev.achievTickByType(`casino${type}WinCount` as any, 1);
    user.achiev.achievTickByType(`casino${type}WinSum` as any, sum);
}