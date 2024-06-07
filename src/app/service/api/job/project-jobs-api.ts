import {ApiClientService} from "../api-client.service";
import {Observable} from "rxjs";
import {InstanceConfig} from "../../../model/instance-config";
import {Job} from "../../../model/job";

export class ProjectJobApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number,
        private readonly jobId: number
    ) {
    }

    public fetch = (): Observable<Job> => this.apiClient.httpGet<Job>(this.instance, `/projects/${this.projectId}/jobs/${this.jobId}`);

    public play = () => this.apiClient.httpPost(this.instance, `/projects/${this.projectId}/jobs/${this.jobId}/play`, {});

    public retry = () => this.apiClient.httpPost(this.instance, `/projects/${this.projectId}/jobs/${this.jobId}/retry`, {});

    public cancel = () => this.apiClient.httpPost(this.instance, `/projects/${this.projectId}/jobs/${this.jobId}/cancel`, {});

    public trace = (): Observable<string> => this.apiClient.httpGetText(this.instance, `/projects/${this.projectId}/jobs/${this.jobId}/trace`);
}
