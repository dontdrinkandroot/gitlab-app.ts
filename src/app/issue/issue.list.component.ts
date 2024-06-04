import {Component, inject} from "@angular/core";
import {ApiService} from "../api/api.service";
import {filter, switchMap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, ResolveFn, RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProjectContext} from "../project/project-context.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {CacheResult} from "../cache/cache";
import {CacheService} from "../cache/cache.service";
import {Issue} from "../api/model";
import {map} from "rxjs/operators";

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

    // public openIssues$ = this.project$.pipe(
    //     switchMap(project => this.api.instance(project.instance).projects.get(project.id).issues().listOpen()),
    // );

    private projectApi$ = this.project$.pipe(
        map((project) => this.api.instance(project.instance).projects.get(project.id))
    );

    public openIssues$ = this.projectApi$.pipe(
        switchMap(projectApi => this.cacheService.cached(
            this.route.data.pipe(map(data => data['issuesOpen'])),
            () => projectApi.issues().listOpen(),
            60
        )));

    public closedIssues$ = this.projectApi$.pipe(
        switchMap(projectApi => this.cacheService.cached(
            this.route.data.pipe(map(data => data['issuesClosed'])),
            () => projectApi.issues().listClosed(),
            60
        )));

    constructor(
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
        private readonly route: ActivatedRoute,
        private readonly cacheService: CacheService
    ) {
    }
}

export const ProjectIssueListOpenCacheResolver: ResolveFn<CacheResult<Issue[]>> = (route, state) => {
    const projectContext = inject(ProjectContext);
    const cacheService = inject(CacheService);

    return projectContext.watchProject().pipe(
        filter(isNonNull),
        switchMap(project => cacheService.getResult<Issue[]>(project.instance.host + '_projects_' + project.id + '_issues_open')),
    );
}

export const ProjectIssueListClosedCacheResolver: ResolveFn<CacheResult<Issue[]>> = (route, state) => {
    const projectContext = inject(ProjectContext);
    const cacheService = inject(CacheService);

    return projectContext.watchProject().pipe(
        filter(isNonNull),
        switchMap(project => cacheService.getResult<Issue[]>(project.instance.host + '_projects_' + project.id + '_issues_closed')),
    );
}
