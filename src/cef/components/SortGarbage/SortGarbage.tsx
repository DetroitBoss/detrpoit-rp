import React, {useCallback, useState} from "react";
import "./style.less"
import png from "./assets/*.png";
import svg from "./assets/*.svg";
import category from "./assets/categoryes/*.svg";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {CustomEvent} from "../../modules/custom.event";

enum ContainerType {
    PAPER,
    GLASS,
    CAN
}

interface IItem {
    img: string
    position: { x: number, y: number }
    type: ContainerType
    completed: boolean
}

interface IContainer {
    color: "White" | "Red" | "Green",
    category: string
    img: string
    imgFront: string
    type: ContainerType
}

const SortGarbage = () => {

    const [dragItem, setDragItem] = useState<number>(null);
    const [container, setContainer] = useState<number>(null);

    const [items, setItems] = useState<IItem[]>([
        {
            img: "paper0",
            position: {x: 0, y: 0},
            type: ContainerType.PAPER,
            completed: false
        },
        {
            img: "metal0",
            position: {x: 0, y: 0},
            type: ContainerType.CAN,
            completed: false
        },
        {
            img: "paper1",
            position: {x: 0, y: 0},
            type: ContainerType.PAPER,
            completed: false
        },
        {
            img: "glass1",
            position: {x: 0, y: 0},
            type: ContainerType.GLASS,
            completed: false
        },
        {
            img: "paper0",
            position: {x: 0, y: 0},
            type: ContainerType.PAPER,
            completed: false
        },
        {
            img: "metal1",
            position: {x: 0, y: 0},
            type: ContainerType.CAN,
            completed: false
        },
        {
            img: "glass0",
            position: {x: 0, y: 0},
            type: ContainerType.GLASS,
            completed: false
        },
        {
            img: "metal0",
            position: {x: 0, y: 0},
            type: ContainerType.CAN,
            completed: false
        },
        {
            img: "glass0",
            position: {x: 0, y: 0},
            type: ContainerType.GLASS,
            completed: false
        }
    ]);

    const [containers] = useState<IContainer[]>([
        {
            color: "White",
            category: "paper",
            img: "blueContainer",
            imgFront: "blueContainerFront",
            type: ContainerType.PAPER
        },
        {
            color: "White",
            category: "glass",
            img: "greenContainer",
            imgFront: "greenContainerFront",
            type: ContainerType.GLASS
        },
        {
            color: "White",
            category: "metal",
            img: "redContainer",
            imgFront: "redContainerFront",
            type: ContainerType.CAN
        }
    ]);

    const onStartDrag = useCallback((key: number) => {
        setDragItem(key);
    }, []);

    const checkOnFinish = useCallback(() => {
        if (items.filter(el => el.completed === false).length === 0)
            CustomEvent.triggerServer('sanitation:sort:completedGame');
    }, []);


    const onStopDrag = useCallback((e: DraggableEvent, data: DraggableData, key: number) => {
        const itemsCopy = [...items];
        if (container === null) return;
        if (containers[container].type === itemsCopy[key].type) {
            itemsCopy[key].position = {x: data.x, y: data.y}
            itemsCopy[key].completed = true;
            setItems(itemsCopy)
        }

        setDragItem(null);
        checkOnFinish();
    }, [items, containers, container, checkOnFinish]);

    const pointerEnter = useCallback((key: number) => {
        setContainer(key);

        if (dragItem === null) return;

        const item = items[dragItem];
        let containersCopy = [...containers];

        if (containers[key].type === item.type) {
            containersCopy[key].color = "Green";
        } else {
            containersCopy[key].color = "Red";
        }

    }, [dragItem]);

    const pointerLeave = useCallback((key: number) => {
        let containersCopy = [...containers];

        containersCopy[key].color = "White";

        setContainer(null);
    }, []);
    return <div className="sortGarbage">
        <img src={png["backgroundImage"]} className="sortGarbage__backgroundImage" alt=""/>

        <div className="sortGarbage-titleTopLeft">
            <span>Рассортируй<br/> мусор</span>
            <p>
                Хватайте мусор и кладите в мешок
            </p>
        </div>


        <div className="sortGarbage-slots">

            {
                items.map((el, key) => {
                    return <Draggable key={key}
                                      defaultPosition={{x: 0, y: 0}}
                                      position={el.position}
                                      onStart={() => onStartDrag(key)}
                                      onStop={(event, data) => onStopDrag(event, data, key)}>
                        <div className={`sortGarbage-slots__${key}`}><img src={png[el.img]} alt=""/></div>
                    </Draggable>
                })
            }

        </div>

        <div className="sortGarbage__bottomLeft">
            <img src={svg["mouse"]} alt=""/>
            Удерживайте ЛКМ, <br/>
            чтобы перетаскивать вещи
        </div>

        <div className="sortGarbage-containers">

            {
                containers.map((el, key) => {
                    return <div className="sortGarbage-containers-block" key={key}>
                        <img src={category[`${el.category}${el.color}`]} alt=""
                             className="sortGarbage-containers-block__category"/>
                        <img src={png[el.img]} alt="" className="sortGarbage-containers-block__container"/>
                        <img src={png[el.imgFront]} alt="" className="sortGarbage-containers-block__containerFront"/>
                        <div className="sortGarbage-containers-block__drop"
                             onPointerEnter={() => pointerEnter(key)}
                             onPointerLeave={() => pointerLeave(key)}/>
                    </div>
                })
            }

        </div>

    </div>

}

export default SortGarbage