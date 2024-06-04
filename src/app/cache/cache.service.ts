import {Injectable} from "@angular/core";
import {Cache, CacheResult, IndexDbCache} from "./cache";
import {combineLatest, EMPTY, Observable, of, startWith, tap} from "rxjs";
import {switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CacheService {
    public readonly cache: Cache = new IndexDbCache()

    /**
     * @param cacheResult$ The prefetched cache result.
     * @param fetchFn The function how to fetch new values (the result is stored in cache).
     * @param validFor Time in seconds when a cache entry is considered stale and a refresh must be performed (although the vache value will be served as a starting value anyway, if it exists).
     * @param refresh$ An Observable that triggers a refetch if value not null (and cache store).
     */
    public cached<T>(
        cacheResult$: Observable<CacheResult<T>>,
        fetchFn: () => Observable<T>,
        validFor: number = 0,
        refresh$: Observable<any> = of(null),
    ): Observable<T> {
        return cacheResult$.pipe(
            switchMap(cacheResult => {
                const initialValue = cacheResult?.value ?? null;
                const needsFetch = !initialValue
                    || validFor <= 0
                    || (Date.now() - cacheResult.created! > validFor * 1000);

                const fetchAndCache$ = fetchFn().pipe(tap(value => this.cache.set(cacheResult.key, value)));

                const fetchAndCacheIfNeeded$ = combineLatest([refresh$, of(needsFetch)]).pipe(
                    switchMap(([refreshTrigger, fetchNeeded]) => (refreshTrigger !== null || fetchNeeded) ? fetchAndCache$ : EMPTY)
                );

                return (initialValue !== null)
                    ? fetchAndCacheIfNeeded$.pipe(startWith(initialValue))
                    : fetchAndCacheIfNeeded$;
            })
        );
    }

    public async getResult<T>(key: string): Promise<CacheResult<T>> {
        return this.cache.getResult<T>(key);
    }
}
