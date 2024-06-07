import {ApiClientService, HttpGetPaginatedOptions} from "../../api-client.service";
import {Observable} from "rxjs";
import {ProjectPipelineApi} from "./project-pipeline-api";
import {InstanceConfig} from "../../../../model/instance-config";
import {Pipeline} from "../../../../model/pipeline";

export class ProjectPipelinesApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number
    ) {
    }

    public list = (limit: number | null = 100): Observable<Pipeline[]> => {
        let options: HttpGetPaginatedOptions = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAll<Pipeline>(this.instance, `/projects/${this.projectId}/pipelines`, options);
    }

    public get = (pipelineId: number) => new ProjectPipelineApi(this.instance, this.apiClient, this.projectId, pipelineId);
}
