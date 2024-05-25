import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'gaStateIcon',
    standalone: true,
})
export class StateIconPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'success':
                return 'check_circle';
            case 'failed':
                return 'cancel';
            case 'running':
                return 'play_arrow';
            case 'pending':
                return 'pause';
            case 'canceled':
                return 'cancel';
            case 'manual':
                return 'manufacturing';
            case 'created':
                return 'schedule';
            default:
                console.log('Unhandled icon:', value);
                return 'help';
        }
    }
}
