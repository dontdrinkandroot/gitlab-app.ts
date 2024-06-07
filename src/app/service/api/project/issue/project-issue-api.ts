import {ApiClientService} from "../../api-client.service";
import {Observable} from "rxjs";
import {InstanceConfig} from "../../../../model/instance-config";
import {Issue} from "../../../../model/issue";
import {IssueNote} from "../../../../model/issue-note";

export class ProjectIssueApi {
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
