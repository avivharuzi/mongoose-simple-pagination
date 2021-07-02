import { getFixedPage } from '../../src/utils';

describe('getFileExtension', () => {
  it('should be 1', () => {
    expect(getFixedPage('1')).toEqual(1);
    expect(getFixedPage('-1')).toEqual(1);
    expect(getFixedPage('-50')).toEqual(1);
    expect(getFixedPage(1)).toEqual(1);
    expect(getFixedPage(-1)).toEqual(1);
    expect(getFixedPage(-50)).toEqual(1);
  });

  it('should be number', () => {
    expect(getFixedPage(50)).toEqual(50);
    expect(getFixedPage('20')).toEqual(20);
  });
});
