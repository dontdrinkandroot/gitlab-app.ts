import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {InstanceConfig} from "../model/instance-config";
import {Project} from "../model/project";

export type ProjectWithInstance = Project & { instance: InstanceConfig; }

@Injectable({providedIn: 'root'})
export class ProjectContext {

    private project$ = new BehaviorSubject<ProjectWithInstance | null>(null);

    constructor(
        private readonly router: Router,
    ) {

    }

    public setProject(instance: InstanceConfig, project: Project) {
        this.project$.next({...project, instance});
    }

    public watchProject() {
        return this.project$.asObservable();
    }

    public registerRouteListener() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                const url = event.url;
                /* Unset url if it does not have scheme /{host}/projects/{id} */
                if (!url.match(/\/[^\/]+\/projects\/\d+/)) {
                    this.project$.next(null);
                }
            }
        });
    }
}
