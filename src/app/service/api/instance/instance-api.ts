import {ApiClientService, HttpGetPaginatedOptions} from "../api-client.service";
import {GroupsApi} from "../group/groups-api";
import {ProjectsApi} from "../project/projects-api";
import {InstanceConfig} from "../../../model/instance-config";
import {Issue} from "../../../model/issue";

export class InstanceApi {
    constructor(
        public readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public groups = new GroupsApi(this.instance, this.apiClient);

    public projects = new ProjectsApi(this.instance, this.apiClient);

    public issuesOpen = (limit: number | null = null) => {
        let options: HttpGetPaginatedOptions = {
            params: {
                state: 'opened',
                scope: 'all'
            }
        };

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Issue>(this.instance, '/issues', options);
    }
}
