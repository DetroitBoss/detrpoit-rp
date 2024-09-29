// @ts-nocheck
export let keysPressed:{[keycode:number]:boolean} = {};
export const keypressCheck = {
  shift: () => !!(keysPressed as any)[16]
}
(window as any).onkeyup = function(e) {
  keysPressed[e.keyCode] = false;
};
(window as any).onkeydown = function(e) {
  keysPressed[e.keyCode] = true;
};

