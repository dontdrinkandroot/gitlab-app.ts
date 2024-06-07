import {Observable} from "rxjs";
import {ApiClientService} from "../api-client.service";
import {ProjectPipelinesApi} from "./pipeline/project-pipelines-api";
import {ProjectJobApi} from "../job/project-jobs-api";
import {ProjectIssuesApi} from "./issue/project-issues-api";
import {InstanceConfig} from "../../../model/instance-config";
import {Project} from "../../../model/project";

export class ProjectApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number
    ) {
    }

    public fetch = (): Observable<Project> => this.apiClient.httpGet<Project>(this.instance, `/projects/${this.projectId}`);

    public pipelines = new ProjectPipelinesApi(this.instance, this.apiClient, this.projectId);

    public jobs = () => ({
        get: (jobId: number) => new ProjectJobApi(this.instance, this.apiClient, this.projectId, jobId),
    });

    public issues = () => new ProjectIssuesApi(this.instance, this.apiClient, this.projectId);
}
