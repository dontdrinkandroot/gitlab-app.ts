import {Component} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {combineLatest, filter, Observable} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SidenavToggleComponent} from "../../sidenav-toggle.component";
import {ProjectAvatarUrlPipePipe} from "../../../pipe/project-avatar-url.pipe";
import {AppendTokenPipe} from "../../../pipe/append-token.pipe";
import {GroupAvatarUrlPipe} from "../../../pipe/group-avatar-url.pipe";
import {isNonNull} from "../../../rxjs-extensions";
import {Group} from "../../../model/group";
import {Project} from "../../../model/project";
import {ApiService} from "../../../service/api/api.service";
import {InstanceContext} from "../../../service/instance-context.service";

@Component({
    standalone: true,
    imports: [
        MatToolbarModule,
        SidenavToggleComponent,
        AsyncPipe,
        MatCardModule,
        MatListModule,
        RouterLink,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        ProjectAvatarUrlPipePipe,
        AppendTokenPipe,
        GroupAvatarUrlPipe
    ],
    templateUrl: './group.detail.component.html'
})
export class GroupDetailComponent {

    public instance$ = this.instanceContext.watchInstance().pipe(filter(isNonNull));

    public group$: Observable<Group>;

    public subgroups$: Observable<Group[]>

    public projects$: Observable<Project[]>;

    constructor(
        private readonly api: ApiService,
        private readonly route: ActivatedRoute,
        private readonly instanceContext: InstanceContext
    ) {

        const id$ = this.route.params.pipe(map(params => +params['id']));

        const groupApi$ = combineLatest([this.instance$, id$]).pipe(
            map(([instance, id]) => this.api.instance(instance).groups.get(id))
        );

        this.group$ = groupApi$.pipe(switchMap(api => api.fetch()));
        this.subgroups$ = groupApi$.pipe(switchMap(api => api.subgroups()));
        this.projects$ = groupApi$.pipe(switchMap(api => api.projects()));
    }
}
