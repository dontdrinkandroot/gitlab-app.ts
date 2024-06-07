import {Pipe, PipeTransform} from "@angular/core";
import {InstanceContext} from "../service/instance-context.service";

@Pipe({
    standalone: true,
    name: 'gaProjectAvatarUrl'
})
export class ProjectAvatarUrlPipePipe implements PipeTransform {
    constructor(private readonly instanceContext: InstanceContext) {
    }

    /**
     * @override
     */
    public transform(id: number): string {
        const instance = this.instanceContext.fetchInstance();
        return `https://${instance.host}/api/v4/projects/${id}/avatar`;
    }
}
