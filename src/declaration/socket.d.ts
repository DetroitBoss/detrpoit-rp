declare module 'socket.io-client' {
    function connect(url:string): Socket;
    export = connect;
}
declare module 'socket.io' {
    class Server {
        listen:(port: number, params: any)=>void;
        on:(event: 'connection', callback: (socket: Socket) => void) => void;
    }
}
interface Socket {
    on(event: string, callback: (...data: any[]) => void ):void;
    emit(event: string, ...data: any[]):void;
    send(data:any):void;
    id: string;
}