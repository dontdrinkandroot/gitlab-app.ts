import {Injectable} from "@angular/core";
import {Cache, CacheResult, LocalStorageCache} from "./cache";
import {Observable, of, tap} from "rxjs";
import {switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CacheService {
    public readonly cache: Cache = new LocalStorageCache()

    /**
     * @param key The key to retrieve and store the cache entry.
     * @param fetchFn The function how to fetch new values (the result is stored in cache).
     * @param validFor Time in seconds when a cache entry is considered stale and a refresh must be performed (although the cache value will be served as a starting value anyway, if it exists).
     * @param refresh$ An Observable that triggers a refetch if value not null (and cache store).
     */
    public cached<T>(
        key: string,
        fetchFn: () => Observable<T>,
        validFor: number = 0,
        refresh$: Observable<any> = of(null),
    ): Observable<T> {

        return refresh$.pipe(
            switchMap(refresh => {
                    const cacheResult = this.cache.getResult<T>(key);
                    const cacheValue = cacheResult.value;
                    const needsRefresh = null !== refresh || validFor <= 0 || !cacheResult.isValid(validFor * 1000);

                    return needsRefresh
                        ? fetchFn().pipe(tap(value => this.cache.set(key, value)))
                        : of(cacheValue!);
                }
            ));
    }

    public getResult<T>(key: string): CacheResult<T> {
        return this.cache.getResult<T>(key);
    }
}
