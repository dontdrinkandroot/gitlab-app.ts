import {Component} from "@angular/core";
import {combineLatest, filter, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {SidenavToggleComponent} from "../../../sidenav-toggle.component";
import {isNonNull} from "../../../../rxjs-extensions";
import {ProjectContext} from "../../../../service/project-context.service";
import {ApiService} from "../../../../service/api/api.service";
import {CacheService} from "../../../../service/cache/cache.service";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatListModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        SidenavToggleComponent,
        MatCardModule,
        DatePipe
    ],
    templateUrl: 'issue.detail.component.html'
})
export class IssueDetailComponent {

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public id$ = this.route.params.pipe(map(params => params['issueId']));

    public notes$ = combineLatest([
        this.project$,
        this.id$
    ]).pipe(
        switchMap(([project, id]) => this.cacheService.cached(
            project.instance.host + '_projects_' + project.id + '_issues_' + id + '_notes',
            () => this.api.instance(project.instance).projects.get(project.id).issues().get(id).notes(),
            60
        ))
    );

    public issue$ = combineLatest([
        this.project$,
        this.id$
    ]).pipe(
        switchMap(([project, id]) => this.cacheService.cached(
            project.instance.host + '_projects_' + project.id + '_issues_' + id,
            () => this.api.instance(project.instance).projects.get(project.id).issues().get(id).fetch(),
            60
        ))
    );

    constructor(
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
        private readonly route: ActivatedRoute,
        private readonly cacheService: CacheService) {
    }
}
