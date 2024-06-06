import {Component} from "@angular/core";
import {ApiService} from "../api/api.service";
import {filter, switchMap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProjectContext, ProjectWithInstance} from "../project/project-context.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {CacheService} from "../cache/cache.service";

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

