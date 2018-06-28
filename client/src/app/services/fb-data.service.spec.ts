import { TestBed, inject } from '@angular/core/testing';

import { FbDataService } from './fb-data.service';

describe('FbDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FbDataService]
    });
  });

  it('should be created', inject([FbDataService], (service: FbDataService) => {
    expect(service).toBeTruthy();
  }));
});
