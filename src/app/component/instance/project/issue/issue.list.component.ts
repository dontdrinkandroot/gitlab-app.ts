import {Component} from "@angular/core";
import {filter, switchMap} from "rxjs";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {SidenavToggleComponent} from "../../../sidenav-toggle.component";
import {isNonNull} from "../../../../rxjs-extensions";
import {ProjectContext, ProjectWithInstance} from "../../../../service/project-context.service";
import {ApiService} from "../../../../service/api/api.service";
import {CacheService} from "../../../../service/cache/cache.service";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatToolbarModule,
        SidenavToggleComponent,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
        DatePipe,
        NgClass,
        MatChipsModule,
        MatTabsModule
    ],
    templateUrl: 'issue.list.component.html'
})
export class IssueListComponent {

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    private projectApi = (project: ProjectWithInstance) => this.api.instance(project.instance).projects.get(project.id);

    public openIssues$ = this.project$.pipe(
        switchMap(project => this.cacheService.cached(
            project.instance.host + '_projects_' + project.id + '_issues_open',
            () => this.projectApi(project).issues().listOpen(),
            60
        )));

    public closedIssues$ = this.project$.pipe(
        switchMap(project => this.cacheService.cached(
            project.instance.host + '_projects_' + project.id + '_issues_closed',
            () => this.projectApi(project).issues().listClosed(),
            60
        )));

    constructor(
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
        private readonly cacheService: CacheService
    ) {
    }
}

