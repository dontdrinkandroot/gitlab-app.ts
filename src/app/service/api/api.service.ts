import {Injectable} from "@angular/core";
import {ApiClientService} from "./api-client.service";
import {InstanceApi} from "./instance/instance-api";
import {InstanceConfig} from "../../model/instance-config";

@Injectable({providedIn: 'root'})
export class ApiService {

    constructor(private apiClient: ApiClientService) {
    }

    public instance = (instanceConfig: InstanceConfig) => new InstanceApi(instanceConfig, this.apiClient);
}
