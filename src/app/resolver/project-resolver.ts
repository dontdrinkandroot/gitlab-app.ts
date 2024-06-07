import {ResolveFn} from "@angular/router";
import {combineLatest, filter, switchMap, tap} from "rxjs";
import {inject} from "@angular/core";
import {map} from "rxjs/operators";
import {ProjectContext, ProjectWithInstance} from "../service/project-context.service";
import {InstanceContext} from "../service/instance-context.service";
import {ApiService} from "../service/api/api.service";
import {isNonNull} from "../rxjs-extensions";

export const projectResolver: ResolveFn<ProjectWithInstance> = (route, state) => {
    const instanceContext = inject(InstanceContext);
    const projectContext = inject(ProjectContext);
    const api = inject(ApiService);
    const projectId = +route.params['projectId'];

    const instance$ = instanceContext.watchInstance().pipe(filter(isNonNull));
    const project$ = instance$.pipe(
        switchMap(instance => {
            return api.instance(instance).projects.get(projectId).fetch();
        }),
    );

    return combineLatest([instance$, project$]).pipe(
        tap(([instance, project]) => {
            projectContext.setProject(instance, project);
        }),
        map(([instance, project]) => ({...project, instance}))
    );
}
