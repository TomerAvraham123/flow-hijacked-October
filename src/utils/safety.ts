const urgentPatterns = [
  /\b(kill|hurt|harm)\s+(myself|yourself|themselves|someone|somebody|another person)\b/i,
  /\b(suicid(?:e|al)|self[- ]?harm|overdose|immediate danger|cannot stay safe|can't stay safe|not safe right now)\b/i,
  /\b(don't|do not) want to (live|be alive)\b/i,
  /(להתאבד|אובדנ(?:י|ית|יים|יות)|פגיעה עצמית|לפגוע בעצמי|לפגוע בעצמך|לפגוע במישהו|לפגוע במישהי|מנת יתר|סכנה מיידית|לא יכול(?:ה)? להישאר בטוח(?:ה)?|לא רוצה לחיות)/,
];

/**
 * A deliberately narrow, local safety net. It does not diagnose or classify a
 * person; it only recognizes explicit urgent-help language so the app can show
 * human support immediately even if Ask or the network fails.
 */
export function needsImmediateSupport(question: string): boolean {
  const normalized = question.normalize('NFKC').trim();
  return urgentPatterns.some((pattern) => pattern.test(normalized));
}
