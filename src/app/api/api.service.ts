import {Injectable} from "@angular/core";
import {Group} from "../group/group";
import {Observable} from "rxjs";
import {Project} from "../project/project";
import {Pipeline} from "../pipeline/pipeline";
import {Job} from "../job/job";
import {ApiClientService, GetParams, HttpGetOptions, HttpGetPaginatedOptions} from "./api-client.service";
import {Issue, IssueNote} from "./model";
import {InstanceConfig} from "../instance/instance-config";

class GroupApi {
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

class GroupsApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public list = (): Observable<Group[]> => this.apiClient.httpPaginatedGetAll<Group>(this.instance, '/groups');

    public get = (groupId: number) => new GroupApi(this.instance, this.apiClient, groupId);
}

class ProjectApi {
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

class ProjectIssuesApi {
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

class ProjectIssueApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number,
        private readonly issueId: number
    ) {
    }

    public fetch = (): Observable<Issue> => this.apiClient.httpGet<Issue>(this.instance, `/projects/${this.projectId}/issues/${this.issueId}`);

    public notes = () => this.apiClient.httpPaginatedGetAll<IssueNote>(this.instance, `/projects/${this.projectId}/issues/${this.issueId}/notes`);
}

class ProjectPipelinesApi {
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

class ProjectPipelineApi {
    constructor(
        private readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService,
        private readonly projectId: number, private readonly pipelineId: number
    ) {
    }

    public fetch = (): Observable<Pipeline> => this.apiClient.httpGet<Pipeline>(this.instance, `/projects/${this.projectId}/pipelines/${this.pipelineId}`);

    public jobs = () => this.apiClient.httpPaginatedGetAll<Job>(this.instance, `/projects/${this.projectId}/pipelines/${this.pipelineId}/jobs`);
}

class ProjectJobApi {
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

class ProjectsApi {
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

class InstanceApi {
    constructor(
        public readonly instance: InstanceConfig,
        private readonly apiClient: ApiClientService
    ) {
    }

    public groups = new GroupsApi(this.instance, this.apiClient);

    public projects = new ProjectsApi(this.instance, this.apiClient);
}

@Injectable({providedIn: 'root'})
export class ApiService {

    constructor(private apiClient: ApiClientService) {
    }

    public instance = (instanceConfig: InstanceConfig) => new InstanceApi(instanceConfig, this.apiClient);
}
