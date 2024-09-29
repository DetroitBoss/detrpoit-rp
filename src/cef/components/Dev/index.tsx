import React, {Component, ErrorInfo} from 'react';
import {CustomEventHandler} from '../../../shared/custom.event';
import {CEF} from '../../modules/CEF';
import {guiNames} from '../../../shared/gui';
import './style.less';
import Draggable from 'react-draggable';

export class ErrorClass extends Component<{}, { error?: Error, errorInfo?: ErrorInfo, hasError: boolean }> {
    ev: CustomEventHandler;
    ev2: CustomEventHandler;
    ev3: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = { hasError: false }

    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log("WE GOT ERROR")
        console.log(error)
        console.log(JSON.stringify(errorInfo))
        this.setState({ error, errorInfo })
    }

    render() {
        return <>
            {this.state.error ? <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: 'black', color: 'white', fontWeight: 800 }}>
                Error: {this.state.error}<hr />
                    ErrorInfo: {this.state.errorInfo}<hr />
            </div> : <>{this.props.children}</>}
        </>
    }
};
export class DebudClass extends Component<{}, { pages: { name: string, gui: guiNames, onClick: () => void }[], hide: boolean }> {
    ev: CustomEventHandler;
    ev2: CustomEventHandler;
    ev3: CustomEventHandler;
    int: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = { pages: [], hide: false }
    }
    componentWillUnmount(){
        if(this.int) clearInterval(this.int)
    }


    render() {
        return <>
            <Draggable handle=".debug_menu">
                <div className="debug_menu">
                    <h2 className="header">DEV Menu</h2>
                    <div className="hide" onClick={e => {
                        e.preventDefault();
                        this.setState({ hide: !this.state.hide})
                    }}>[{this.state.hide ? '+' : '-'}]</div>
                    {!this.state.hide ? this.state.pages.map((page, pageid) => {
                        return <button className='debug_menu_item' key={`debug_menu_item_${pageid}`} onClick={e => {
                            e.preventDefault();
                            if(CEF.gui.currentGui !== page.gui) CEF.gui.setGui(page.gui);
                            if (page.onClick) page.onClick();
                        }}>{page.name}</button>
                    }) : <></>}
                </div>
            </Draggable>

        </>
    }
};