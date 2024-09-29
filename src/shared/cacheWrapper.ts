export class CacheWrapper<TReturn> {
    private readonly cache: Map<string, TReturn> = new Map<string, TReturn>();

    constructor(
        private readonly handler: (...args: any[]) => TReturn
    ) { }

    public get(...args: any[]): TReturn {
        const hashKey = CacheWrapper.getHashKey(args);
        const cachedValue = this.cache.get(hashKey);
        if (cachedValue) {
            return cachedValue;
        } else {
            const value = this.handler(args);
            this.cache.set(hashKey, value);
            return value;
        }
    }

    private static getHashKey(args: any[]): string {
        return args.map(a => a.toString()).join('-');
    }
}
