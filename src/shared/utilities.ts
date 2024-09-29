/**
 * Возвращает положительный результат в случае, если только один из аргументов будет положительным.
 * @param args Аргументы для проверки
 */
export function testOneOfBooleans(...args: boolean[]): boolean {
    return args.filter(a => a).length === 1;
}