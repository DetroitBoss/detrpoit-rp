export interface Notification {
    id: number, 
    program: string,
    title: string,
    text: string,
    type?: "default" | "success" | "error",
    timer?: number,
    time?: string
}