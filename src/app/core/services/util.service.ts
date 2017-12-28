import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

    constructor(
        private router: Router
    ) { }

    errDeal(err) {
        if(err && !isNaN(err.status)) {
            switch(err.status){
                case 403:
                  console.log('token 超时');
                  this.router.navigate(['/login'])
                  return 
                  
            }
        }
    }

}