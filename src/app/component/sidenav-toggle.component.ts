import {Component} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe} from "@angular/common";
import {toSignal} from "@angular/core/rxjs-interop";
import {SidenavService} from "../service/sidenav.service";

@Component({
    selector: 'ga-mat-sidenav-toggle',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, AsyncPipe],
    template: `
        <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
        </button>`,
    host: {
        '[style.display]': 'visible() ? "block" : "none"'
    }
})
export class SidenavToggleComponent {

    public visible = toSignal(this.sidenavService.watchToggleVisible(), {initialValue: false});

    constructor(private sidenavService: SidenavService) {
    }

    public toggleSidenav() {
        this.sidenavService.toggle();
    }
}
