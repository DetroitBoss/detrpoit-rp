type HookHandler<T> = (...args: any[]) => T;

const registeredHooks = new Map<string, HookHandler<any>[]>();

/**
 * Проходится по обработчикам хука и вызывает их в порядке регистрации
 * @param name Уникальное имя хука
 * @param args Аргументы, передаваемые в хэндлеры
 * @return - Исключает из результатов обработчиков null и undefined объекты
 */
export function invokeHook<T>(name: string, ...args: any[]): T[] {
    const hookHandlers = registeredHooks.get(name);
    if (hookHandlers) {
        return hookHandlers.map(handler => handler(...args))
            .filter(result => !!result || typeof result === 'boolean');
    }

    return [];
}

export function registerHookHandler<T>(name: string, handler: HookHandler<T>) {
    if (registeredHooks.has(name)) {
        registeredHooks.get(name).push(handler);
    } else {
        registeredHooks.set(name, [handler]);
    }
}

export function unregisterHookHandler<T>(name: string, handler: HookHandler<T>) {
    if (registeredHooks.has(name)) {
        const handlers = registeredHooks.get(name);
        const idx = handlers.findIndex(_handler => _handler === handler);
        if (idx === -1) {
            return;
        }

        handlers.splice(idx, 1);
    }
}
