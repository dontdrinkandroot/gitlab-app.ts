import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from "./app/component/app.component";

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
