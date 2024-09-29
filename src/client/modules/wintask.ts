import {CustomEvent} from './custom.event';
import {gui} from './gui';

CustomEvent.registerServer('wintask:create', (taskName: string, item: Array<{type:number, ammount: number, desc?:string}>) => {
  gui.setGui('wintask')
  CustomEvent.triggerCef('wintask:show', taskName, item)
})