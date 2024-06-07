import {ApiClientService, HttpGetPaginatedOptions} from "../../api-client.service";
import {Observable} from "rxjs";
import {ProjectIssueApi} from "./project-issue-api";
import {InstanceConfig} from "../../../../model/instance-config";
import {Issue} from "../../../../model/issue";

export class ProjectIssuesApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number
    ) {
    }

    public get = (issueId: number) => new ProjectIssueApi(this.instance, this.apiClient, this.projectId, issueId);

    public list = (limit: number | null = null): Observable<Issue[]> => {
        let options: HttpGetPaginatedOptions = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Issue>(this.instance, `/projects/${this.projectId}/issues`, options);
    }

    public listOpen = (limit: number | null = null): Observable<Issue[]> => {
        let options: HttpGetPaginatedOptions = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Issue>(this.instance, `/projects/${this.projectId}/issues?state=opened`, options);
    }

    public listClosed = (limit: number | null = null): Observable<Issue[]> => {
        let options: HttpGetPaginatedOptions = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Issue>(this.instance, `/projects/${this.projectId}/issues?state=closed`, options);
    }
}


