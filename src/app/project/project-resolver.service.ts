import {ResolveFn} from "@angular/router";
import {combineLatest, filter, switchMap, tap} from "rxjs";
import {ApiService} from "../api/api.service";
import {inject} from "@angular/core";
import {InstanceContext} from "../instance/instance-context.service";
import {ProjectContext, ProjectWithInstance} from "./project-context.service";
import {isNonNull} from "../rxjs/extensions";
import {map} from "rxjs/operators";

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
