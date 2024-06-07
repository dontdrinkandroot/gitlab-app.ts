import {Component} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {Router, RouterLink} from "@angular/router";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {InstanceCreateDialogComponent} from "../instance/instance-create-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe} from "@angular/common";
import {SidenavToggleComponent} from "../sidenav-toggle.component";
import {InstanceService} from "../../service/instance.service";

@Component({
    standalone: true,
    imports: [
        SidenavToggleComponent,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        AsyncPipe,
        MatToolbarModule,
        RouterLink
    ],
    templateUrl: "./index.component.html"
})
export class IndexComponent {

    public instances$;

    public hostControl = new FormControl();

    constructor(
        private readonly instanceService: InstanceService,
        private readonly router: Router,
        private readonly dialog: MatDialog
    ) {
        this.instances$ = this.instanceService.watchInstances().pipe(
            // tap(instances => {
            //     if (instances.length === 1) {
            //         this.router.navigate(["/", instances[0].host]);
            //     }
            // })
        )
    }

    public openCreateInstanceDialog() {
        const dialogRef = this.dialog.open(InstanceCreateDialogComponent);
    }
}
