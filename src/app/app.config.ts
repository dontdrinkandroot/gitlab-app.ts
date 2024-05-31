import {ApplicationConfig, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject, isDevMode} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NG_PROGRESS_CONFIG} from "ngx-progressbar";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {provideServiceWorker} from '@angular/service-worker';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {InstanceService} from "./instance/instance.service";
import {ProjectContext} from "./project/project-context.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withInMemoryScrolling({
            scrollPositionRestoration: 'enabled'
        })),
        provideAnimationsAsync(),
        importProvidersFrom(NgProgressHttpModule),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: NG_PROGRESS_CONFIG,
            useValue: {
                spinner: false
            }
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                subscriptSizing: 'dynamic'
            }
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue() {
                inject(InstanceService).registerRouteListener()
            }
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue() {
                inject(ProjectContext).registerRouteListener()
            }
        },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
};
