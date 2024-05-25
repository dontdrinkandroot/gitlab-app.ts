import {Pipe, PipeTransform} from "@angular/core";
import {InstanceService} from "../instance/instance.service";

@Pipe({
    standalone: true,
    name: 'gaProjectAvatarUrl'
})
export class ProjectAvatarUrlPipePipe implements PipeTransform {
    constructor(private readonly instanceService: InstanceService) {
    }

    /**
     * @override
     */
    public transform(id: number): string {
        const instance = this.instanceService.fetchCurrentInstance();
        return `https://${instance.host}/api/v4/projects/${id}/avatar`;
    }
}
