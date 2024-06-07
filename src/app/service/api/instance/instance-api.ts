import {ApiClientService, HttpGetPaginatedOptions, OptionalGetParams} from "../api-client.service";
import {GroupsApi} from "../group/groups-api";
import {ProjectsApi} from "../project/projects-api";
import {InstanceConfig} from "../../../model/instance-config";
import {Issue} from "../../../model/issue";

export interface IssuesParams extends OptionalGetParams {
    assignee_id?: number,
    assignee_username?: string,
    author_id?: number,
    author_username?: string,
    confidential?: boolean,
    created_after?: string,
    created_before?: string,
    due_date?: string,
    epic_id?: number,
    health_status?: string,
    iids?: number[],
    in?: string,
    issue_type?: string,
    iteration_id?: number,
    iteration_title?: string,
    labels?: string,
    milestone_id?: number,
    milestone?: string,
    my_reaction_emoji?: string,
    non_archived?: boolean,
    not?: string,
    order_by?: string,
    scope?: string,
    search?: string,
    sort?: string,
    state?: string,
    updated_after?: string,
    updated_before?: string,
    weight?: number,
    with_labels_details?: boolean,
}

export class InstanceApi {
    constructor(
        public readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public groups = new GroupsApi(this.instance, this.apiClient);

    public projects = new ProjectsApi(this.instance, this.apiClient);

    public issues = (params: IssuesParams = <IssuesParams>{}, limit: number | null = null) => {
        let options: HttpGetPaginatedOptions = {params: this.apiClient.convertParams(params)};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Issue>(this.instance, '/issues', options);
    }
}
