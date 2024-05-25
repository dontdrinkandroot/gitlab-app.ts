import {ResolveFn} from "@angular/router";
import {Group} from "./group";
import {ApiService} from "../api/api.service";
import {inject} from "@angular/core";

export const groupResolver: ResolveFn<Group> = (route, state) => {
    const groupId = +route.params['id'];
    return inject(ApiService).getGroup(groupId);
}
