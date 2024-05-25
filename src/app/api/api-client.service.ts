import {Injectable} from "@angular/core";
import {Cache, LocalStorageCache} from "../cache/cache";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InstanceService} from "../instance/instance.service";
import {catchError, EMPTY, expand, filter, Observable, reduce, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {isNonNull} from "../rxjs/extensions";
import {InstanceConfig} from "../instance/instance-config";

export type GetParams = { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }

export type HttpGetOptions = {
    params?: GetParams;
}

export type HttpGetOptionsCached = HttpGetOptions & {
    customCacheKey?: string;
}

export type HttpGetPaginatedOptions = {
    params?: GetParams;
    perPage?: number;
    maxPages?: number;
}

export type HttpGetPaginatedOptionsCached = HttpGetPaginatedOptions & {
    customCacheKey?: string;
    ttl?: number;
}

@Injectable({providedIn: 'root'})
export class ApiClientService {
    private cache: Cache;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly instanceService: InstanceService
    ) {
        this.cache = new LocalStorageCache('api_cache_');
    }

    public httpGet<T>(path: string, options: HttpGetOptions = {}): Observable<T> {
        const instance = this.instanceService.fetchCurrentInstance();
        return this.httpClient.get<T>(this.getUrl(instance, path), {
            params: new HttpParams({fromObject: options.params}),
            headers: {
                'Authorization': 'Bearer ' + instance.token,
            }
        }).pipe(
            catchError((error) => {
                this.snackBar.open('Failed to load data', 'Dismiss');
                return [];
            })
        )
    }

    public httpGetText(path: string, options: HttpGetOptions = {}): Observable<string> {
        const instance = this.instanceService.fetchCurrentInstance();
        return this.httpClient.get(this.getUrl(instance, path), {
            params: new HttpParams({fromObject: options.params}),
            headers: {
                'Authorization': 'Bearer ' + instance.token,
            },
            responseType: 'text'
        }).pipe(
            catchError((error) => {
                this.snackBar.open('Failed to load data', 'Dismiss');
                return '';
            })
        )
    }

    public httpPaginatedGetAll<T>(path: string, options: HttpGetPaginatedOptions = {}): Observable<T[]> {
        const instance = this.instanceService.fetchCurrentInstance();
        const url = this.getUrl(instance, path);
        const mergedParams = Object.assign({page: 1, per_page: options.perPage ?? 100}, options.params);
        return this.httpClient.get<T[]>(url, {
            observe: 'response',
            params: mergedParams,
            headers: {
                'Authorization': 'Bearer ' + instance.token,
            }
        }).pipe(
            expand((response) => {
                const nextPage = response.headers.get('x-next-page');
                if (null == nextPage || '' === nextPage || (null != options.maxPages && parseInt(nextPage) > options.maxPages)) {
                    return EMPTY;
                }
                const mergedParams = Object.assign({page: nextPage, per_page: options.perPage ?? 100}, options.params);
                return this.httpClient.get<T[]>(url, {
                    observe: 'response',
                    params: mergedParams,
                    headers: {
                        'Authorization': 'Bearer ' + instance.token,
                    }
                });
            }),
            map((response) => response.body!),
            reduce((acc: T[], projects) => acc.concat(projects), []),
            catchError((error) => {
                this.snackBar.open('Failed to load data', 'Dismiss');
                return [];
            }),
        );
    }

    public httpGetCached<T>(path: string, options: HttpGetOptionsCached = {}): Observable<T> {
        const host = this.instanceService.fetchCurrentInstance().host;
        const cacheKey = options.customCacheKey || `${host}_${path}_${JSON.stringify((options.params ?? {}))}`;
        const data = this.cache.get<T>(cacheKey);

        return this.httpGet<T>(path, {params: options.params}).pipe(
            map((data) => {
                this.cache.set(cacheKey, data);
                return data;
            }),
            startWith(data),
            filter(isNonNull),
        );
    }

    public httpPaginatedGetAllCached<T>(path: string, options: HttpGetPaginatedOptionsCached = {}): Observable<T[]> {
        const host = this.instanceService.fetchCurrentInstance().host;
        const cacheKey = options.customCacheKey || `${host}_${path}_${JSON.stringify((options.params ?? {}))}`;
        const data = this.cache.get<T[]>(cacheKey);

        return this.httpPaginatedGetAll<T>(path, {
            params: options.params,
            perPage: options.perPage,
            maxPages: options.maxPages
        }).pipe(
            map((data) => {
                this.cache.set(cacheKey, data);
                return data;
            }),
            startWith(data),
            filter(isNonNull),
        );
    }

    public httpPost<T>(path: string, body: any): Observable<T> {
        const instance = this.instanceService.fetchCurrentInstance();
        return this.httpClient.post<T>(this.getUrl(instance, path), body, {
            headers: {
                'Authorization': 'Bearer ' + instance.token,
            }
        });
    }

    private getUrl(instance: InstanceConfig, path: string): string {
        return 'https://' + instance.host + '/api/v4' + path;
    }
}
