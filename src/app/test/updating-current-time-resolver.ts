import {ResolveFn} from "@angular/router";
import {interval} from "rxjs";
import {map} from "rxjs/operators";

export const UpdatingCurrentTimeResolver: ResolveFn<number> = () => {
    return interval(1000).pipe(
        map(_ => Date.now())
    );
}
