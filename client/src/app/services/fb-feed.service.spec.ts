import { TestBed, inject } from '@angular/core/testing';

import { FbFeedService } from './fb-feed.service';

describe('FbFeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FbFeedService]
    });
  });

  it('should be created', inject([FbFeedService], (service: FbFeedService) => {
    expect(service).toBeTruthy();
  }));
});
