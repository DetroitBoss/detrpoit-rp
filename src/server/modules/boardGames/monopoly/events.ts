import {CustomEvent} from "../../custom.event";
import {boardGameManager} from "../index";

CustomEvent.registerCef('monopoly:throwDices', (player: PlayerMp) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.onPlayerThrewDices(player)
})

CustomEvent.registerCef('monopoly:sellFirms', (player: PlayerMp, firmIds: number[]) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.onPlayerSellFirms(player, firmIds)
})

CustomEvent.registerCef('monopoly:buy:confirm', (player: PlayerMp) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.onPlayerConfirmBuyFirm(player)
})

CustomEvent.registerCef('monopoly:buy:reject', (player: PlayerMp) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.onPlayerRejectBuyFirm(player)
})

CustomEvent.registerCef('monopoly:sell', (player: PlayerMp, firmId: number) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.onPlayerSellFirm(player, firmId)
})

CustomEvent.registerCef('monopoly:playerLeft', (player: PlayerMp) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.removePlayer(player)
})

CustomEvent.registerClient('monopoly:playerLeft', (player: PlayerMp) => {
    return boardGameManager.getPlayerMonopolyGame(player)?.removePlayer(player)
})

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player?.user) return
    return boardGameManager.getPlayerMonopolyGame(player)?.removePlayer(player)
})