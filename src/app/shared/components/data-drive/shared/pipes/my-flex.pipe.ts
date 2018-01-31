import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFlex'
})
export class MyFlexPipe implements PipeTransform {

  transform(value: any, args?: { name: string, parmas: any[] }): any {
    if (args && this[args.name]) {
      args.parmas = args.parmas || [];
      return this[args.name](value,...args.parmas);
    }else {
      return value;
    }
  }

  replace(target: string, o: any) {
    if (target && typeof o === 'object') {
      for (let prop in o) {
        target = target.replace(prop, o[prop]);
      }
      return target
    } else {
      return target;
    }
  }

}