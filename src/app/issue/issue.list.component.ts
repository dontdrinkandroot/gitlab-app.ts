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
import {ProjectContext} from "../project/project-context.service";

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

    public project$ = this.projectContext.watchProject().pipe(filter(isNonNull));

    public issues$ = this.project$.pipe(
        filter(isNonNull),
        switchMap(project => this.api.instance(project.instance).projects.get(project.id).issues().list(100)),
    );

    constructor(
        private readonly projectContext: ProjectContext,
        private readonly api: ApiService,
    ) {
    }
}
