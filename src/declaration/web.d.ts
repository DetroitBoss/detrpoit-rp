declare module '*.webm' {
    const content: any;
    export default content;
}
declare module '*.mp4' {
    const content: any;
    export default content;
}
declare module '*.gif' {
    const content: any;
    export default content;
}
declare module '*.webp' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}
declare module '*.jpg' {
    const content: any;
    export default content;
}
declare module '*.png' {
    const content: any;
    export default content;
}
declare module '*.mp3' {
    const content: any;
    export default content;
}
declare module '*.ogg' {
    const content: string;
    export default content;
}

declare module '*.wav' {
    const content: string;
    export default content;
}


interface CefWindow {
  chatAPI: any;

}
//@ts-ignore
declare var window: CefWindow