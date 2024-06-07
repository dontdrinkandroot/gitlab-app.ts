import {Pipe, PipeTransform} from "@angular/core";
import {InstanceContext} from "../service/instance-context.service";

@Pipe({
    name: 'gaAppendToken',
    standalone: true
})
export class AppendTokenPipe implements PipeTransform {
    constructor(private instanceContext: InstanceContext) {
    }

    /**
     * @override
     */
    public transform(url: string): string {
        const token = this.instanceContext.getInstance()?.token;
        if (!token) {
            return url;
        }

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}private_token=${token}`;
    }
}
