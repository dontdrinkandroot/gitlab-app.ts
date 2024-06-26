import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {InstanceConfig} from "../model/instance-config";

@Injectable({providedIn: 'root'})
export class InstanceContext {
    private instance$ = new BehaviorSubject<InstanceConfig | null>(null);

    public setInstance(instance: InstanceConfig | null) {
        this.instance$.next(instance);
    }

    public watchInstance() {
        return this.instance$.asObservable();
    }

    public getInstance(): InstanceConfig | null {
        return this.instance$.value;
    }

    public fetchInstance(): InstanceConfig {
        const instance = this.instance$.value;
        if (instance === null) {
            throw new Error('No instance set');
        }
        return instance;
    }
}
