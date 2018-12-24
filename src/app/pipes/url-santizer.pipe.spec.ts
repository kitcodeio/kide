import { UrlSantizerPipe } from './url-santizer.pipe';

describe('UrlSantizerPipe', () => {
  it('create an instance', () => {
    const pipe = new UrlSantizerPipe();
    expect(pipe).toBeTruthy();
  });
});
