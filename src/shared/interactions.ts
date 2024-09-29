let ids = 0;
export class interractionMenuBasic {
    /** Параметр отвечает за то, чтобы меню само спряталось при нажатии на любую кнопку */
    autoClose = true;
    onBack?:() => void;
    onExit?:() => void;
    onNext?:() => void;
    static list = new Map <number, interractionMenuBasic>();
    name: string;
    static get(id: number){
        return this.list.get(id)
    }
    readonly id: number;
    items: InteractionItem[] = [];
    constructor(name?: string){
        ids++;
        this.name = name;
        this.id = parseInt(`${ids}`);
        interractionMenuBasic.list.set(this.id, this);
    }

    /**
     * Добавить элемент в окно взаимодействие
     * @param name - Название
     * @param category - Категория (использовать '' для отображения на главном меню)
     * @param icon - название иконки
     * @param handle - callback
     */
    add(name: string, category: string, icon: string, handle: () => void) {
        this.items.push({ name, handle, icon, category });
    }
    handle(id: number){
        const item = this.items[id];
        if (!item) return;
        item.handle();
    }
}

export class InteractionItem {
    constructor(
        public readonly name: string,
        public readonly icon: string,
        public readonly category: string,
        public readonly handle: () => void,
    ) { }
}