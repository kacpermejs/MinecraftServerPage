import { TestBed } from '@angular/core/testing';

import { ImageFileRegisterService } from './image-file-register.service';

describe('ImageFileRegisterService', () => {
  let service: ImageFileRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFileRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
