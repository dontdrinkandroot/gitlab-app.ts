import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, EMPTY, expand, Observable, reduce} from "rxjs";
import {map} from "rxjs/operators";
import {InstanceConfig} from "../instance/instance-config";

export type GetParams = { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }

export type HttpGetOptions = {
    params?: GetParams;
}

export type HttpGetPaginatedOptions = {
    params?: GetParams;
    perPage?: number;
    maxPages?: number;
}

@Injectable({providedIn: 'root'})
export class ApiClientService {

    constructor(
        private readonly httpClient: HttpClient,
        private readonly snackBar: MatSnackBar,
    ) {
    }

    public httpGet<T>(instance: InstanceConfig, path: string, options: HttpGetOptions = {}): Observable<T> {
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

    public httpGetText(instance: InstanceConfig, path: string, options: HttpGetOptions = {}): Observable<string> {
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

    public httpPaginatedGetAll<T>(instance: InstanceConfig, path: string, options: HttpGetPaginatedOptions = {}): Observable<T[]> {
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

    public httpPost<T>(instance: InstanceConfig, path: string, body: any): Observable<T> {
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
