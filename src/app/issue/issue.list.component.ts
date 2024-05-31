import {Component} from "@angular/core";
import {ProjectService} from "../project/project.service";
import {ApiService} from "../api/api.service";
import {filter, switchMap, tap} from "rxjs";
import {isNonNull} from "../rxjs/extensions";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {InstanceContext} from "../instance/instance-context.service";

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
    ],
    templateUrl: './issue.list.component.html'
})
export class IssueListComponent {

    public instance$ = this.instanceContext.watchInstance();

    public project$ = this.projectService.watchCurrentProject();

    public issues$ = this.project$.pipe(
        tap(console.log),
        filter(isNonNull),
        tap(console.log),
        switchMap(project => this.api.projects.get(project.id).issues().list(100)),
    );

    constructor(
        private readonly projectService: ProjectService,
        private readonly api: ApiService,
        private readonly instanceContext: InstanceContext
    ) {
    }
}
