import {Component} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {ApiService} from "../api/api.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {Observable} from "rxjs";
import {Group} from "./group";
import {Project} from "../project/project";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {InstanceConfig} from "../instance/instance-config";
import {AppendTokenPipe} from "../instance/append-token.pipe";
import {ProjectAvatarUrlPipePipe} from "../project/project-avatar-url.pipe";
import {GroupAvatarUrlPipe} from "./group-avatar-url.pipe";
import {InstanceContext} from "../instance/instance-context.service";

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

    public group$: Observable<Group>;

    public subgroups$: Observable<Group[]>

    public projects$: Observable<Project[]>;

    public instance: InstanceConfig;

    constructor(
        private readonly api: ApiService,
        private readonly route: ActivatedRoute,
        private readonly instanceContext: InstanceContext
    ) {
        this.instance = this.instanceContext.fetchInstance();
        const id$ = this.route.params.pipe(map(params => +params['id']));
        this.group$ = id$.pipe(switchMap(id => this.api.groups.get(id).fetch()));
        this.subgroups$ = id$.pipe(switchMap(id => this.api.groups.get(id).subgroups()));
        this.projects$ = id$.pipe(switchMap(id => this.api.groups.get(id).projects()));
    }

    public getProjectAvatar(id: number): string {
        const avatar = `https://${this.instance.host}/api/v4/projects/${id}/avatar`;
        console.log({avatar})
        return avatar
    }
}
