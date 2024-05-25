import {Component} from "@angular/core";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {InstanceService} from "../instance/instance.service";
import {ApiService} from "../api/api.service";
import {MatListModule} from "@angular/material/list";
import {AppendTokenPipe} from "../instance/append-token.pipe";
import {ProjectAvatarUrlPipePipe} from "./project-avatar-url.pipe";
import {RouterLink} from "@angular/router";
import {map} from "rxjs/operators";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {combineLatest, startWith} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ProjectGenericAvatarDataPipe} from "./project-generic-avatar-data.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatToolbarModule,
        SidenavToggleComponent,
        MatListModule,
        AppendTokenPipe,
        NgOptimizedImage,
        ProjectAvatarUrlPipePipe,
        RouterLink,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinner,
        ProjectGenericAvatarDataPipe,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './project.list.component.html'
})
export class ProjectListComponent {

    public instance$ = this.instanceService.watchCurrentInstance();

    public searchControl = new FormControl('', {nonNullable: true});

    public projects$ = this.api.projects.list(true).pipe(
        map((projects) => projects.sort((a, b) => a.last_activity_at > b.last_activity_at ? -1 : 1))
    )

    public filteredProjects$ = combineLatest([this.projects$, this.searchControl.valueChanges.pipe(startWith(''))])
        .pipe(
            map(([projects, search]) => {
                if ('' === search) {
                    return projects;
                }
                return projects.filter((project) => {
                    return project.name.toLowerCase().includes(search.toLowerCase()) || project.namespace.full_path.toLowerCase().includes(search.toLowerCase());
                });
            })
        )

    constructor(
        private readonly instanceService: InstanceService,
        private readonly api: ApiService
    ) {

    }
}
