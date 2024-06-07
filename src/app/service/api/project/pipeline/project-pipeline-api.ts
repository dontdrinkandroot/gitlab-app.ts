import {ApiClientService} from "../../api-client.service";
import {Observable} from "rxjs";
import {InstanceConfig} from "../../../../model/instance-config";
import {Pipeline} from "../../../../model/pipeline";
import {Job} from "../../../../model/job";

export class ProjectPipelineApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number, private readonly pipelineId: number
    ) {
    }

    public fetch = (): Observable<Pipeline> => this.apiClient.httpGet<Pipeline>(this.instance, `/projects/${this.projectId}/pipelines/${this.pipelineId}`);

    public jobs = () => this.apiClient.httpPaginatedGetAll<Job>(this.instance, `/projects/${this.projectId}/pipelines/${this.pipelineId}/jobs`);
}
