import {Injectable} from "@angular/core";
import {Cache, LocalStorageCache} from "./cache";
import {combineLatest, EMPTY, iif, Observable, of, startWith, tap} from "rxjs";
import {switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CacheService {
    private readonly cache: Cache = new LocalStorageCache('cache_');

    constructor() {
    }

    /**
     * @param key The cache key.
     * @param fetchFn The function how to fetch new values (the result is stored in cache).
     * @param refresh$ An Observable that triggers a refetch if value not null (and cache store).
     * @param validFor Time in seconds when a cache entry is considered stale and a refresh must be performed (although the vache value will be served as a starting value anyway, if it exists).
     */
    public cached<T>(
        key: string,
        fetchFn: () => Observable<T>,
        refresh$?: Observable<any>,
        validFor?: number
    ): Observable<T> {
        const actualRefresh$ = refresh$ || of(null);

        const fetchAndCache$ = fetchFn().pipe(
            tap((value) => this.cache.set(key, value))
        );

        const cacheEntry$ = of(this.cache.getEntry<T>(key));

        /* Perform refresh if cache entry is stale or value of actualRefresh$ is not null */
        const refreshAndFetch$ = combineLatest([cacheEntry$, actualRefresh$]).pipe(
            switchMap(([cacheEntry, refresh]) => {
                const cacheEntryStale = (null == cacheEntry) || (validFor && Date.now() - cacheEntry.created > validFor * 1000);
                return iif(() => refresh || cacheEntryStale, fetchAndCache$, EMPTY);
            })
        );

        /* Now start with cache entry value if not null */
        return cacheEntry$.pipe(
            switchMap((cacheEntry) => {
                return iif(() => null != cacheEntry, of(cacheEntry!.value), EMPTY);
            }),
            switchMap((cacheValue) => {
                return refreshAndFetch$.pipe(startWith(cacheValue));
            })
        );
    }
}
