import {Component} from "@angular/core";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {InstanceService} from "../../service/instance.service";

@Component({
    standalone: true,
    imports: [
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        FormsModule,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatPrefix,
        MatSuffix,
        ReactiveFormsModule,
        MatButton,
        AsyncPipe,
        MatProgressSpinner
    ],
    templateUrl: "./instance-create-dialog.component.html"
})
export class InstanceCreateDialogComponent {

    public submitting$ = new BehaviorSubject<boolean>(false);

    public hideToken = true;

    public instanceForm = new FormGroup({
        instance: new FormControl('gitlab.com', [Validators.required]),
        token: new FormControl('', [Validators.required]),
    });

    constructor(
        public dialogRef: MatDialogRef<InstanceCreateDialogComponent>,
        private readonly snackBar: MatSnackBar,
        private readonly instanceService: InstanceService
    ) {
    }

    public onSubmit() {
        const instance = this.instanceForm.get('instance')!.value;
        const token = this.instanceForm.get('token')!.value;
        if (null === instance || null === token) {
            this.snackBar.open('Please fill in all fields', 'Close');
            return;
        }

        /* Validate and add instance or show error message in snackbar */
        this.submitting$.next(true);
        this.instanceService.validateAndAdd(instance, token)
            .then((instanceConfig) => {
                this.dialogRef.close(instanceConfig);
            })
            .catch(() => {
                this.submitting$.next(false);
                this.snackBar.open('Invalid token', 'Close');
            });
    }
}
