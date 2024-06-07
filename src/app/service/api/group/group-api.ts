import {ApiClientService} from "../api-client.service";
import {Observable} from "rxjs";
import {InstanceConfig} from "../../../model/instance-config";
import {Group} from "../../../model/group";
import {Project} from "../../../model/project";

export class GroupApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly groupId: number
    ) {
    }

    public fetch = (): Observable<Group> => this.apiClient.httpGet<Group>(this.instance, `/groups/${this.groupId}`);

    public subgroups = (): Observable<Group[]> => this.apiClient.httpPaginatedGetAll<Group>(this.instance, `/groups/${this.groupId}/subgroups`);

    public projects = (): Observable<Project[]> => this.apiClient.httpPaginatedGetAll<Project>(this.instance, `/groups/${this.groupId}/projects`);
}
