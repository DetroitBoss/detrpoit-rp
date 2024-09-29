import { CustomEvent } from "../custom.event";

CustomEvent.register("duckWalk", () => ButtonHandler());


const ButtonHandler = () => {
    CustomEvent.triggerServer('duckWalk:toggle');
}