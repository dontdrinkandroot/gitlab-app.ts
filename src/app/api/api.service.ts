import {Injectable} from "@angular/core";
import {Group} from "../group/group";
import {Observable} from "rxjs";
import {Project} from "../project/project";
import {Pipeline} from "../pipeline/pipeline";
import {Job} from "../job/job";
import {ApiClientService, HttpGetOptions, HttpGetPaginatedOptionsCached} from "./api-client.service";
import {Issue} from "./model";

class GroupApi {
    constructor(private readonly apiClient: ApiClientService, private readonly groupId: number) {
    }

    public fetch = (): Observable<Group> => this.apiClient.httpGetCached<Group>(`/groups/${this.groupId}`);

    public subgroups = (): Observable<Group[]> => this.apiClient.httpPaginatedGetAllCached<Group>(`/groups/${this.groupId}/subgroups`);

    public projects = (): Observable<Project[]> => this.apiClient.httpPaginatedGetAllCached<Project>(`/groups/${this.groupId}/projects`);
}

class GroupsApi {
    constructor(private readonly apiClient: ApiClientService) {
    }

    public list = (): Observable<Group[]> => this.apiClient.httpPaginatedGetAllCached<Group>('/groups');

    public get = (groupId: number) => new GroupApi(this.apiClient, groupId);
}

class ProjectApi {
    constructor(private readonly apiClient: ApiClientService, private readonly projectId: number) {
    }

    public fetch = (): Observable<Project> => this.apiClient.httpGetCached<Project>(`/projects/${this.projectId}`);

    public pipelines = () => new ProjectPipelinesApi(this.apiClient, this.projectId);

    public jobs = () => ({
        get: (jobId: number) => new ProjectJobApi(this.apiClient, this.projectId, jobId),
    });
}

class ProjectIssuesApi {
    constructor(private readonly apiClient: ApiClientService, private readonly projectId: number) {
    }

    public list = (limit: number | null = 100): Observable<Issue[]> => {
        let options: HttpGetPaginatedOptionsCached = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAllCached<Issue>(`/projects/${this.projectId}/issues`, options);
    }
}

class ProjectPipelinesApi {
    constructor(private readonly apiClient: ApiClientService, private readonly projectId: number) {
    }

    public list = (limit: number | null = 100): Observable<Pipeline[]> => {
        let options: HttpGetPaginatedOptionsCached = {};

        if (limit) {
            options.perPage = limit;
            options.maxPages = 1;
        }

        return this.apiClient.httpPaginatedGetAllCached<Pipeline>(`/projects/${this.projectId}/pipelines`, options);
    }

    public get = (pipelineId: number) => new ProjectPipelineApi(this.apiClient, this.projectId, pipelineId);
}

class ProjectPipelineApi {
    constructor(private readonly apiClient: ApiClientService, private readonly projectId: number, private readonly pipelineId: number) {
    }

    public fetch = (): Observable<Pipeline> => this.apiClient.httpGetCached<Pipeline>(`/projects/${this.projectId}/pipelines/${this.pipelineId}`);

    public jobs = () => this.apiClient.httpPaginatedGetAllCached<Job>(`/projects/${this.projectId}/pipelines/${this.pipelineId}/jobs`);
}

class ProjectJobApi {
    constructor(private readonly apiClient: ApiClientService, private readonly projectId: number, private readonly jobId: number) {
    }

    public fetch = (): Observable<Job> => this.apiClient.httpGetCached<Job>(`/projects/${this.projectId}/jobs/${this.jobId}`);

    public play = () => this.apiClient.httpPost(`/projects/${this.projectId}/jobs/${this.jobId}/play`, {});

    public retry = () => this.apiClient.httpPost(`/projects/${this.projectId}/jobs/${this.jobId}/retry`, {});

    public cancel = () => this.apiClient.httpPost(`/projects/${this.projectId}/jobs/${this.jobId}/cancel`, {});

    public trace = (): Observable<string> => this.apiClient.httpGetText(`/projects/${this.projectId}/jobs/${this.jobId}/trace`);
}

class ProjectsApi {
    constructor(private readonly apiClient: ApiClientService) {
    }

    public list = (membership: boolean | null = null): Observable<Project[]> => {
        let options: HttpGetOptions = {};
        if (membership !== null) {
            options.params = {membership: membership};
        }

        return this.apiClient.httpPaginatedGetAll<Project>('/projects', options);
    }

    public get = (projectId: number) => new ProjectApi(this.apiClient, projectId);
}

@Injectable({providedIn: 'root'})
export class ApiService {

    constructor(private apiClient: ApiClientService) {
    }

    public groups = new GroupsApi(this.apiClient);

    public projects = new ProjectsApi(this.apiClient);
}
