import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {ApiService} from "../api/api.service";
import {Project} from "./project";

@Injectable({providedIn: 'root'})
export class ProjectService {
    private readonly currentProject$ = new BehaviorSubject<Project | null>(null);

    constructor(
        private readonly apiService: ApiService,
        private readonly router: Router,
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                const url = event.url;
                /* Unset url if it does not have scheme /{host}/projects/{id} */
                if (!url.match(/\/[^\/]+\/projects\/\d+/)) {
                    this.currentProject$.next(null);
                }
            }
        });
    }

    public setCurrentProject(project: Project | null): void {
        this.currentProject$.next(project);
    }

    public watchCurrentProject() {
        return this.currentProject$.asObservable();
    }
}
