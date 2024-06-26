import {Component} from "@angular/core";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BehaviorSubject, combineLatest, filter, startWith} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SidenavToggleComponent} from "../../sidenav-toggle.component";
import {AppendTokenPipe} from "../../../pipe/append-token.pipe";
import {ProjectAvatarUrlPipePipe} from "../../../pipe/project-avatar-url.pipe";
import {ProjectGenericAvatarDataPipe} from "../../../pipe/project-generic-avatar-data.pipe";
import {isNonNull} from "../../../rxjs-extensions";
import {InstanceContext} from "../../../service/instance-context.service";
import {ApiService} from "../../../service/api/api.service";
import {CacheService} from "../../../service/cache/cache.service";

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

    public instance$ = this.instanceContext.watchInstance().pipe(filter(isNonNull));

    private refresh$ = new BehaviorSubject<number | null>(null);

    public searchControl = new FormControl('', {nonNullable: true});

    public projects$ = this.instance$.pipe(
        switchMap((instance) =>
            this.cacheService.cached(
                instance.host + '_projects_with_membership',
                () => this.api.instance(instance).projects.list(true, true),
                60,
                this.refresh$,
            )
        ),
        map((projects) => projects.sort((a, b) => a.last_activity_at > b.last_activity_at ? -1 : 1))
    );

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
        );

    constructor(
        private readonly instanceContext: InstanceContext,
        private readonly api: ApiService,
        private readonly cacheService: CacheService,
        private route: ActivatedRoute
    ) {
    }

    public refresh() {
        this.refresh$.next(Date.now());
    }
}
