import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {MatDrawerMode, MatSidenav, MatSidenavContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgProgressModule} from "ngx-progressbar";
import {AsyncPipe, DOCUMENT, NgClass} from "@angular/common";
import {distinctUntilChanged, filter, fromEvent, Observable, Subscription} from "rxjs";
import {SidenavService} from "./sidenav/sidenav.service";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SwUpdate} from "@angular/service-worker";
import {map} from "rxjs/operators";
import {InstanceContext} from "./instance/instance-context.service";
import {ProjectContext} from "./project/project-context.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        MatSidenavModule,
        MatToolbarModule, NgProgressModule,
        AsyncPipe,
        MatListModule,
        RouterLink,
        NgClass,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterLinkActive
    ],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {

    @ViewChild(MatSidenav, {static: true})
    public sidenav!: MatSidenav;

    @ViewChild(MatSidenavContent, {static: true})
    public sidenavContent!: MatSidenavContent;

    public currentInstance$;

    public currentProject$ = this.projectContext.watchProject();

    public sidenavOpened$: Observable<boolean> = this.sidenavService.getOpenedObservable();

    public sidenavMode$: Observable<MatDrawerMode> = this.sidenavService.getModeObservable();

    private subscriptions: Subscription[] = [];

    constructor(
        private readonly sidenavService: SidenavService,
        private readonly instanceContext: InstanceContext,
        private readonly projectContext: ProjectContext,
        private readonly router: Router,
        @Inject(DOCUMENT) private readonly document: Document,
        swUpdate: SwUpdate,
    ) {
        this.currentInstance$ = this.instanceContext.watchInstance();

        if (swUpdate.isEnabled) {
            swUpdate.versionUpdates.subscribe((event) => {
                switch (event.type) {
                    case 'VERSION_READY':
                        document.location.reload();
                        break;
                }
            });
        }
    }

    /**
     * @override
     */
    public ngOnInit() {
        this.sidenavService.setSidenav(this.sidenav);

        const navigationEnd$: Observable<boolean> = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(event => event as NavigationEnd),
            map(() => true)
        );

        this.subscriptions.push(navigationEnd$.subscribe({
            next: (event) => this.sidenavContent.scrollTo({top: 0})
        }));

        const scrollSubscription = fromEvent(this.document, 'scroll')
            .pipe(
                map(() => this.document.documentElement.scrollTop > 0),
                distinctUntilChanged()
            ).subscribe((scrolled) => {
                if (scrolled) {
                    this.document.body.classList.add('scrolled');
                } else {
                    this.document.body.classList.remove('scrolled');
                }

                const themeColors = this.document.head.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
                themeColors.forEach((themeColor: HTMLMetaElement) => {
                    const media = themeColor.media;
                    if (media === '(prefers-color-scheme: light)') {
                        themeColor.content = scrolled ? '#efedf1' : '#fdfbff';
                    } else if (media === '(prefers-color-scheme: dark)') {
                        themeColor.content = scrolled ? '#1e1f23' : '#1a1b1f';
                    }
                });
            });
        this.subscriptions.push(scrollSubscription);
    }

    /**
     * @override
     */
    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
