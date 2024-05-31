import {Injectable} from "@angular/core";
import {Cache, IndexDbCache} from "./cache";
import {combineLatest, EMPTY, from, Observable, of, startWith, tap} from "rxjs";
import {switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CacheService {
    private readonly cache: Cache = new IndexDbCache()

    /**
     * @param key The cache key.
     * @param fetchFn The function how to fetch new values (the result is stored in cache).
     * @param validFor Time in seconds when a cache entry is considered stale and a refresh must be performed (although the vache value will be served as a starting value anyway, if it exists).
     * @param refresh$ An Observable that triggers a refetch if value not null (and cache store).
     */
    public cached<T>(
        key: string,
        fetchFn: () => Observable<T>,
        validFor: number = 0,
        refresh$: Observable<any> = of(null),
    ): Observable<T> {
        const cacheEntry$ = from(this.cache.getEntry<T>(key));

        return cacheEntry$.pipe(
            switchMap(cacheEntry => {
                const initialValue = cacheEntry?.value ?? null;
                const needsFetch = !initialValue || validFor <= 0 || (Date.now() - cacheEntry!.created > validFor * 1000);

                const fetchAndCache$ = fetchFn().pipe(tap(value => this.cache.set(key, value)));

                const fetchAndCacheIfNeeded$ = combineLatest([refresh$, of(needsFetch)]).pipe(
                    switchMap(([refreshTrigger, fetchNeeded]) => (refreshTrigger !== null || fetchNeeded) ? fetchAndCache$ : EMPTY)
                );

                return (initialValue !== null)
                    ? fetchAndCacheIfNeeded$.pipe(startWith(initialValue))
                    : fetchAndCacheIfNeeded$;
            })
        );
    }
}
