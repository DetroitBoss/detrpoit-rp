import {CustomEvent} from "../../custom.event";
import {boardGameManager} from "../index";
import {BoardGameType} from "../../../../shared/boardGames/tables";
import {PokerMove} from "./pokerPlayer";

/*
* + poker:addPlayer(playerDTO) - игрокам за столом при заходе нового
* + poker:removePlayer(playerDTO) - игрокам за столом при выходе текущего
* + poker:startGame(tableDTO) - игроку при заходе на любой стол, в т.ч на пустой
* + poker:player:move(playerDTO(обновленный)) - игрокам за столом при совершении хода игроком
* + poker:table:updateCards(cardsDTO[]) - игрокам за столом при наступлении новой стадии игры
* poker:table:results(winnerDTO?) - игрокам за столом при завершении игры
* стадии игры:
*/

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player || !player.user) {
        return;
    }
    boardGameManager.getPlayerPokerGame(player)?.removePlayer(player)
});

CustomEvent.registerCef('poker:player:onMove', (player, move: PokerMove, raisedValue: number) => {
    boardGameManager.getPlayerPokerGame(player)?.dealing.onPlayerMadeMove(player, move, raisedValue)
})

CustomEvent.registerCef('poker:player:leave', (player) => {
    boardGameManager.getPlayerPokerGame(player)?.lobby.removePlayer(player)
})