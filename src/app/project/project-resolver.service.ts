import {ResolveFn} from "@angular/router";
import {Project} from "./project";
import {tap} from "rxjs";
import {ApiService} from "../api/api.service";
import {inject} from "@angular/core";
import {ProjectService} from "./project.service";

export const projectResolver: ResolveFn<Project> = (route, state) => {
    const projectService = inject(ProjectService);
    const api = inject(ApiService);
    const projectId = +route.params['projectId'];
    return api.projects.get(projectId).fetch().pipe(
        tap(project => projectService.setCurrentProject(project))
    );
}
