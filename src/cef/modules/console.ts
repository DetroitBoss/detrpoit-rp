export const debug = {
    log: (...message: any[]) => mp.trigger('console:cef', ...message)
}