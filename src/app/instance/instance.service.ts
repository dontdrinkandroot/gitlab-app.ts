import {Injectable} from "@angular/core";
import {InstanceConfig} from "./instance-config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../user/user";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class InstanceService {

    private instances$ = new BehaviorSubject<InstanceConfig[]>([]);

    private currentInstance$ = new BehaviorSubject<InstanceConfig | null>(null);

    constructor(
        private readonly httpClient: HttpClient,
        private readonly router: Router
    ) {
        this.instances$.next(JSON.parse(localStorage.getItem('instances') || '[]'));
    }

    public async validateAndAdd(host: string, token: string): Promise<InstanceConfig> {
        const user = await lastValueFrom<User>(this.httpClient.get<User>(`https://${host}/api/v4/user`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }));
        const instance: InstanceConfig = {host, token, 'username': user.username};
        const instances = this.instances$.value;
        instances.push(instance);
        this.instances$.next(instances);
        this.saveInstances();

        return instance;
    }

    public removeInstance(host: string) {
        const instances = this.instances$.value.filter(i => i.host !== host);
        this.instances$.next(instances);
        this.saveInstances();
    }

    public saveInstances() {
        localStorage.setItem('instances', JSON.stringify(this.instances$.value));
    }

    public findByHost(host: string): InstanceConfig | null {
        return this.instances$.value.find(i => i.host === host) || null;
    }

    public watchInstances() {
        return this.instances$.asObservable();
    }

    public watchCurrentInstance() {
        return this.currentInstance$.asObservable();
    }

    public getCurrentInstance() {
        return this.currentInstance$.value;
    }

    public fetchCurrentInstance() {
        const instance = this.currentInstance$.value;
        if (null === instance) {
            throw new Error('No instance selected');
        }

        return instance;
    }

    public setCurrentInstanceByHost(host: string) {
        const instance = this.instances$.value.find(i => i.host === host) || null;
        this.currentInstance$.next(instance);
    }
}
