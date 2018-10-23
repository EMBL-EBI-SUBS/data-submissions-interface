import { YesNoPipe } from './yes-no.pipe';

describe('YesNoPipe', () => {
  it('create an instance', () => {
    const pipe = new YesNoPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns "yes"', () => {
    const pipe = new YesNoPipe();
    expect(pipe.transform('1')).toEqual(' Yes ');
    expect(pipe.transform(true)).toEqual(' Yes ');
    expect(pipe.transform(true, 'OK')).toEqual(' OK ');
  });

  it('returns "no"', () => {
    const pipe = new YesNoPipe();
    expect(pipe.transform('')).toEqual(' No ');
    expect(pipe.transform('0')).toEqual(' No ');
    expect(pipe.transform(null)).toEqual(' No ');
    expect(pipe.transform(false)).toEqual(' No ');
    expect(pipe.transform(false, 'OK', 'Not OK')).toEqual(' Not OK ');
  });
});
