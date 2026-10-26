import { needsImmediateSupport } from '@/utils/safety';

describe('local urgent-support routing', () => {
  it('recognizes explicit urgent language in English and Hebrew', () => {
    expect(needsImmediateSupport('I do not want to live.')).toBe(true);
    expect(needsImmediateSupport('What should someone do if they may be in immediate danger?')).toBe(true);
    expect(needsImmediateSupport('אני חושב לפגוע בעצמי')).toBe(true);
    expect(needsImmediateSupport('יש סכנה מיידית של מנת יתר')).toBe(true);
  });

  it('does not divert ordinary educational recovery questions', () => {
    expect(needsImmediateSupport('Why can craving narrow attention?')).toBe(false);
    expect(needsImmediateSupport('איך עייפות משפיעה על דחף?')).toBe(false);
    expect(needsImmediateSupport('What does the research say about stress?')).toBe(false);
  });
});
