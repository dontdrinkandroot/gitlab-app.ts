import {Component} from "@angular/core";
import {InstanceContext} from "../../service/instance-context.service";
import {filter, switchMap} from "rxjs";
import {isNonNull} from "../../rxjs-extensions";
import {AsyncPipe} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {SidenavToggleComponent} from "../sidenav-toggle.component";
import {ApiService} from "../../service/api/api.service";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        MatToolbar,
        SidenavToggleComponent
    ],
    templateUrl: 'instance-detail.component.html'
})
export class InstanceDetailComponent {

    public instance$ = this.instanceContext.watchInstance().pipe(filter(isNonNull));

    public recentIssues$ = this.instance$.pipe(
        switchMap(instance => this.apiService.instance(instance).issues({
            state: 'opened',
            scope: 'all',
            order_by: 'updated_at',
        }, 5))
    );

    constructor(
        private readonly instanceContext: InstanceContext,
        private readonly apiService: ApiService,
    ) {

    }
}
