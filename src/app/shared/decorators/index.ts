import { Observable, of, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export function ToObservable(target: any, key: string, descriptor: any) {
  const originalMethod = descriptor.value;
  const newMethod = function(...args: any[]): any {
    const result: any = originalMethod.apply(this, args);
    if (typeof result.subscribe === 'function') {
      return result;
    } else if (typeof result.then === 'function') {
      return new Observable<any>(ob => {
        result
          .then(_ => {
            ob.next(_);
            ob.complete();
          })
          .catch(e => ob.error(e));
      });
    } else {
      return of(result);
    }
  };
  descriptor.value = newMethod;
}

export function Throttle(time: number) {
  return (target: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value,
      subject = new Subject(),
      valueSubject = new Subject();
    subject
      .asObservable()
      .pipe(throttleTime(time))
      .subscribe((params: any[]) => {
        const that = params.shift();
        valueSubject.next(originalMethod.apply(that, params));
      });
    const newMethod = function(...args: any[]): any {
      const params = Array.from(args);
      params.unshift(this);
      subject.next(params);
      return valueSubject.asObservable();
    };
    descriptor.value = newMethod;
  };
}
