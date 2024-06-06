export interface CacheEntry<T> {
    value: T;
    lastUsed: number;
    timesUsed: number;
    created: number;
}

export class CacheResult<T> {
    constructor(
        public readonly key: string,
        public readonly value?: T,
        public readonly createdTimestamp?: number,
    ) {
    }

    public isHit(): boolean {
        return this.value !== undefined;
    }

    public isValid(validFor: number): boolean {
        return this.createdTimestamp !== undefined
            && (Date.now() - this.createdTimestamp < validFor);
    }
}

export interface Cache {
    /**
     * Check if a key exists in the cache. Does not update access information.
     * @param key
     */
    has(key: string): boolean;

    /**
     * Get a value from the cache. Updates access information.
     * @param key
     */
    get<T>(key: string): T | null;

    /**
     * Get a value from the cache. Updates access information.
     * @param key
     */
    getResult<T>(key: string): CacheResult<T>;

    /**
     * Set a value in the cache.
     * @param key
     * @param value
     */
    set<T>(key: string, value: T): CacheResult<T>;

    /**
     * Delete a value from the cache.
     * @param key
     */
    delete(key: string): any;
}

export class InMemoryCache implements Cache {
    private readonly entries: Map<string, CacheEntry<any>> = new Map();

    public has(key: string): boolean {
        return this.entries.has(key);
    }

    public get<T>(key: string): T | null {
        const entry = this.getAndUpdateEntry<T>(key);
        return entry ? entry.value : null;
    }

    public getResult<T>(key: string): CacheResult<T> {
        const entry = this.getAndUpdateEntry<T>(key);
        return new CacheResult<T>(key, entry?.value, entry?.created);
    }

    public set<T>(key: string, value: T): CacheResult<T> {
        const entry: CacheEntry<T> = {
            value,
            lastUsed: Date.now(),
            timesUsed: 1,
            created: Date.now(),
        };

        this.entries.set(key, entry);

        return new CacheResult<T>(key, value, entry.created);
    }

    public delete(key: string): void {
        this.entries.delete(key);
    }

    private getAndUpdateEntry<T>(key: string): CacheEntry<T> | undefined {
        const entry = this.getEntry<T>(key);
        if (entry) {
            entry.lastUsed = Date.now();
            entry.timesUsed++;
        }
        return entry;
    }

    private getEntry<T>(key: string): CacheEntry<T> | undefined {
        return this.entries.get(key) as CacheEntry<T> | undefined;
    }
}

export class LocalStorageCache implements Cache {

    private readonly keys: Set<string>;

    constructor(
        private readonly storagePrefix = 'cache_'
    ) {
        this.keys = new Set<string>(JSON.parse(localStorage.getItem('cacheKeys') || '[]'));
    }

    public has(key: string): boolean {
        return this.keys.has(key);
    }

    public set<T>(key: string, value: T): CacheResult<T> {

        const entry: CacheEntry<T> = {
            value,
            lastUsed: Date.now(),
            timesUsed: 1,
            created: Date.now(),
        }

        try {
            this.keys.add(key);
            localStorage.setItem('cacheKeys', JSON.stringify(Array.from(this.keys)));
            localStorage.setItem(this.storagePrefix + key, JSON.stringify(entry));
        } catch (e) {
            console.error('Could not store cache entry, cleaning up', e);
            this.expunge();
        }

        return new CacheResult<T>(key, value, entry.created);
    }

    public get<T>(key: string): T | null {
        const entry = this.getAndUpdateEntry<T>(key);
        return entry ? entry.value : null;
    }

    public getResult<T>(key: string): CacheResult<T> {
        const entry = this.getAndUpdateEntry<T>(key);
        return new CacheResult<T>(key, entry?.value, entry?.created);
    }

    public delete(key: string): void {
        this.keys.delete(key);
        localStorage.setItem('cacheKeys', JSON.stringify(Array.from(this.keys)));
        localStorage.removeItem(this.storagePrefix + key);
    }

    private getAndUpdateEntry<T>(key: string): CacheEntry<T> | undefined {
        const entry = this.getEntry<T>(key);
        if (entry) {
            entry.lastUsed = Date.now();
            entry.timesUsed++;
            localStorage.setItem(this.storagePrefix + key, JSON.stringify(entry));
        }
        return entry;
    }

    private getEntry<T>(key: string): CacheEntry<T> | undefined {
        const entry = localStorage.getItem(this.storagePrefix + key);
        return entry ? JSON.parse(entry) : undefined;
    }

    /** Expunge according to LFU, keep 10 entries */
    private expunge() {
        const results: CacheResult<any>[] = Array.from(this.keys)
            .map(key => {
                const entry = this.getEntry(key);
                return new CacheResult(key, entry?.value, entry?.created);
            })
            .sort((a, b) => a.createdTimestamp! - b.createdTimestamp!);

        const toDelete = results.slice(0, Math.max(0, results.length - 10));
        toDelete.forEach(result => this.delete(result.key));
    }
}
