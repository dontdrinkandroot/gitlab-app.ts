import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'gaStateColorClass',
    standalone: true,
})
export class StateColorClassPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'success':
                return 'text-success';
            case 'failed':
                return 'text-danger';
            case 'running':
                return 'text-info';
            case 'pending':
                return 'text-info';
            case 'canceled':
                return 'text-danger';
            case 'manual':
                return 'text-warning';
            case 'created':
                return '';
            default:
                console.log('Unhandled color class:', value);
                return '';
        }
    }
}
