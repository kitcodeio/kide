import { TestBed } from '@angular/core/testing';

import { XtermService } from './xterm.service';

describe('XtermService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XtermService = TestBed.get(XtermService);
    expect(service).toBeTruthy();
  });
});
