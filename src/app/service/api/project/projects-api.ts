import {ApiClientService, GetParams, HttpGetOptions} from "../api-client.service";
import {Observable} from "rxjs";
import {ProjectApi} from "./project-api";
import {Project} from "../../../model/project";
import {InstanceConfig} from "../../../model/instance-config";

export class ProjectsApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public list = (
        membership: boolean | null = null,
        simple: boolean | null = null
    ): Observable<Project[]> => {
        let options: HttpGetOptions = {};
        const params: GetParams = {};
        if (membership !== null) {
            params['membership'] = membership;
        }
        if (simple !== null) {
            params['simple'] = simple;
        }
        options.params = params;

        return this.apiClient.httpPaginatedGetAll<Project>(this.instance, '/projects', options);
    }

    public get = (projectId: number) => new ProjectApi(this.instance, this.apiClient, projectId);
}
