import {Component} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SecurityService} from "../security/security.service";
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    standalone: true,
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSnackBarModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    public hideToken = true;

    public loginForm = new FormGroup({
        instance: new FormControl(this.securityService.getInstance(), [Validators.required]),
        token: new FormControl('', [Validators.required]),
    });

    constructor(private readonly router: Router, private readonly securityService: SecurityService, private readonly snackBar: MatSnackBar) {
    }

    public onSubmit() {

        const instance = this.loginForm.get('instance')!.value;
        const token = this.loginForm.get('token')!.value;
        if (null === instance || null === token) {
            this.snackBar.open('Please fill in all fields', 'Close');
            return;
        }

        this.securityService.login(instance, token)
            .then(() => this.router.navigate(['/']))
            .catch(() => this.snackBar.open('Invalid token', 'Close'));
    }
}
