import {ApiClientService} from "../api-client.service";
import {Observable} from "rxjs";
import {GroupApi} from "./group-api";
import {InstanceConfig} from "../../../model/instance-config";
import {Group} from "../../../model/group";

export class GroupsApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public list = (): Observable<Group[]> => this.apiClient.httpPaginatedGetAll<Group>(this.instance, '/groups');

    public get = (groupId: number) => new GroupApi(this.instance, this.apiClient, groupId);
}
