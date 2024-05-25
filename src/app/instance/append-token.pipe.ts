import {Pipe, PipeTransform} from "@angular/core";
import {InstanceService} from "./instance.service";

@Pipe({
    name: 'gaAppendToken',
    standalone: true
})
export class AppendTokenPipe implements PipeTransform {
    constructor(private instanceService: InstanceService) {
    }

    /**
     * @override
     */
    public transform(url: string): string {
        const token = this.instanceService.getCurrentInstance()?.token;
        if (!token) {
            return url;
        }

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}private_token=${token}`;
    }
}
