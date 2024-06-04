import {Component, inject} from "@angular/core";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {ApiService} from "../api/api.service";
import {MatListModule} from "@angular/material/list";
import {AppendTokenPipe} from "../instance/append-token.pipe";
import {ProjectAvatarUrlPipePipe} from "./project-avatar-url.pipe";
import {ActivatedRoute, ResolveFn, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BehaviorSubject, combineLatest, filter, startWith} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ProjectGenericAvatarDataPipe} from "./project-generic-avatar-data.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CacheService} from "../cache/cache.service";
import {isNonNull} from "../rxjs/extensions";
import {InstanceContext} from "../instance/instance-context.service";
import {Project} from "./project";
import {CacheResult} from "../cache/cache";

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

    private instanceApi$ = this.instance$.pipe(
        map((instance) => this.api.instance(instance))
    );

    public projects$ = this.instanceApi$.pipe(
        switchMap((instanceApi) =>
            this.cacheService.cached(
                this.route.data.pipe(map(data => data['cachedProjects'])),
                () => instanceApi.projects.list(true, true),
                60, // 1 Minute
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

export const ProjectListCacheResolver: ResolveFn<CacheResult<Project[]>> = (route, state) => {
    const instanceContext = inject(InstanceContext);
    const cacheService = inject(CacheService);

    return instanceContext.watchInstance().pipe(
        filter(isNonNull),
        switchMap((instance) => cacheService.cache.getResult<Project[]>(instance.host + '_projects_with_membership')),
    );
}
