/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyErrorHandlerService } from './myErrorHandler.service';

describe('Service: MyErrorHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyErrorHandlerService]
    });
  });

  it('should ...', inject([MyErrorHandlerService], (service: MyErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
