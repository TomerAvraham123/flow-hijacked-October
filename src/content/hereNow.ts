import type { HereNowEntry } from '@/types/content';
import type { Bilingual } from '@/types/recovery';

const bi = (en: string, he: string): Bilingual => ({ en, he });

type UndatedEntry = Omit<HereNowEntry, 'date'>;

const entries: UndatedEntry[] = [
  {
    title: bi('The part of the day that is still yours', 'החלק ביום שעדיין שייך לכם'),
    reflection: [
      bi(
        'A difficult morning can quietly claim the rest of the day. One conversation, a craving, poor sleep or a mistake begins to speak as if it already knows how the evening will end. The mind turns an event into a forecast, and the forecast starts to feel like a fact.',
        'בוקר קשה יכול להשתלט בשקט על שאר היום. שיחה אחת, דחף, לילה בלי שינה או טעות מתחילים לדבר כאילו הם כבר יודעים כיצד הערב יסתיים. הראש הופך אירוע לתחזית, והתחזית מתחילה להרגיש כמו עובדה.',
      ),
      bi(
        'But a day is not one uninterrupted state. Bodies change after food and movement. Attention changes when a cue is removed. Shame changes when it is spoken aloud to someone safe. Even if the larger problem remains, the conditions of the next ten minutes can be different from the conditions of the last ten.',
        'אבל יום אינו מצב אחד רצוף. הגוף משתנה אחרי אוכל ותנועה. הקשב משתנה כשמרחיקים רמז. בושה משתנה כשאומרים אותה בקול לאדם בטוח. גם אם הבעיה הגדולה נשארת, התנאים של עשר הדקות הבאות יכולים להיות שונים מן התנאים של עשר הדקות שחלפו.',
      ),
      bi(
        'You do not have to rescue the entire day. Look for the part that has not happened yet. It may be very small: one shower, one phone call, one meal, one room with less pressure. That is not pretending everything is fine. It is refusing to let one state speak for every state that could still follow.',
        'לא צריך להציל את כל היום. חפשו את החלק שעדיין לא קרה. הוא יכול להיות קטן מאוד: מקלחת אחת, שיחת טלפון אחת, ארוחה אחת, חדר אחד שיש בו פחות לחץ. זו אינה העמדת פנים שהכול בסדר. זו סירוב לתת למצב אחד לדבר בשם כל המצבים שעוד יכולים להגיע אחריו.',
      ),
    ],
    coreSentence: bi('This moment is real, but it has not earned the right to predict the whole day.', 'הרגע הזה אמיתי, אבל הוא עדיין לא קיבל את הזכות לנבא את היום כולו.'),
    actionTitle: bi('Change the conditions of ten minutes', 'לשנות את התנאים של עשר דקות'),
    action: [
      bi('Name one thing in the immediate environment that is adding pressure.', 'תנו שם לדבר אחד בסביבה הקרובה שמוסיף עכשיו לחץ.'),
      bi('Make one physical change: move rooms, step outside, drink water, eat or remove the cue.', 'עשו שינוי גופני אחד: עברו חדר, צאו החוצה, שתו מים, אכלו או הרחיקו את הרמז.'),
      bi('After ten minutes, notice only whether another option has become slightly more available.', 'אחרי עשר דקות, בדקו רק אם אפשרות נוספת נעשתה קצת יותר נגישה.'),
    ],
    scientificLayer: bi('State-dependent processing means the same option can feel different under different levels of arousal, fatigue and cue exposure. A small environmental change can alter the next transition without solving the whole system.', 'עיבוד תלוי־מצב פירושו שאותה אפשרות יכולה להרגיש אחרת תחת רמות שונות של עוררות, עייפות וחשיפה לרמזים. שינוי קטן בסביבה יכול להשפיע על המעבר הבא גם בלי לפתור את המערכת כולה.'),
    therapyLayer: bi('Behavioral activation and relapse-prevention work often begin by changing conditions before waiting for motivation to arrive. The experiment is deliberately small so that it can be completed from a constrained state.', 'אקטיבציה התנהגותית ומניעת מעידה מתחילות לעיתים בשינוי התנאים, עוד לפני שמחכים למוטיבציה. הניסוי קטן בכוונה, כדי שיהיה אפשר לבצע אותו גם מתוך מצב מצומצם.'),
    lovedOneLayer: bi('If someone you care about is having a difficult day, help make one next interval safer or lighter. You do not have to persuade them that the whole future is bright.', 'אם אדם יקר לכם עובר יום קשה, עזרו להפוך את פרק הזמן הבא לבטוח או קל מעט יותר. אינכם צריכים לשכנע אותו שכל העתיד בהיר.'),
  },
  {
    title: bi('Rest is not the same as disappearing', 'מנוחה אינה היעלמות'),
    reflection: [
      bi(
        'There are days when stopping feels dangerous. If you rest, the thoughts may arrive. If you put the phone down, the emptiness may become audible. So exhaustion is answered with more stimulation, more movement or one more hour of staying elsewhere.',
        'יש ימים שבהם עצירה מרגישה מסוכנת. אם תנוחו, המחשבות אולי יגיעו. אם תניחו את הטלפון, הריק עלול להישמע. כך עונים לעייפות בעוד גירוי, עוד תנועה או עוד שעה של שהייה במקום אחר.',
      ),
      bi(
        'Useful rest is not a demand to become peaceful. It is a temporary reduction in what the system must process. You can rest without solving yourself, understanding everything or producing a meaningful insight. Sometimes the humane act is simply to lower the incoming load.',
        'מנוחה מועילה אינה דרישה להפוך לרגועים. היא הפחתה זמנית של מה שהמערכת נדרשת לעבד. אפשר לנוח בלי לפתור את עצמכם, להבין הכול או לייצר תובנה משמעותית. לפעמים המעשה האנושי הוא פשוט להקטין את העומס שנכנס.',
      ),
      bi(
        'The distinction is intention. Disappearing says: I must not be here. Rest says: I am here, and for a few minutes I will ask less of myself. That small difference can protect both dignity and energy.',
        'ההבדל נמצא בכוונה. היעלמות אומרת: אסור לי להיות כאן. מנוחה אומרת: אני כאן, ובמשך כמה דקות אבקש מעצמי פחות. ההבדל הקטן הזה יכול לשמור גם על הכבוד וגם על האנרגיה.',
      ),
    ],
    coreSentence: bi('For a few minutes, I can remain present while asking less of myself.', 'לכמה דקות אני יכול להישאר נוכח, ובו בזמן לבקש מעצמי פחות.'),
    actionTitle: bi('Seven minutes with less input', 'שבע דקות עם פחות גירוי'),
    action: [
      bi('Set a gentle seven-minute timer.', 'כוונו טיימר עדין לשבע דקות.'),
      bi('Lie down or sit with the screen away, without requiring meditation.', 'שכבו או שבו כשהמסך רחוק, בלי לדרוש מעצמכם לעשות מדיטציה.'),
      bi('When the timer ends, choose whether to continue, drink something or stand up slowly.', 'כשהטיימר מסתיים, בחרו אם להמשיך, לשתות משהו או לקום לאט.'),
    ],
    scientificLayer: bi('Reducing sensory and task load can change arousal and attentional demand. This is not a universal nervous-system reset, and the response will differ by person and state.', 'הפחתת עומס חושי ועומס משימות יכולה לשנות עוררות ודרישות קשב. זה אינו “אתחול” אוניברסלי של מערכת העצבים, והתגובה משתנה מאדם לאדם וממצב למצב.'),
    therapyLayer: bi('Distress-tolerance skills often aim first to help a person remain safely inside a difficult interval. They do not require the interval to become pleasant.', 'מיומנויות של סבילות למצוקה נועדו לעיתים קודם כול לעזור לאדם להישאר בבטחה בתוך פרק זמן קשה. הן אינן דורשות שהזמן הזה יהפוך לנעים.'),
    lovedOneLayer: bi('Offering quiet company can be more useful than offering explanations. “I can sit here with you for ten minutes” is a complete form of support.', 'נוכחות שקטה יכולה להיות מועילה יותר מהסברים. “אני יכול לשבת כאן איתך עשר דקות” היא צורה שלמה של תמיכה.'),
  },
  {
    title: bi('One honest signal is enough', 'מספיק אות כן אחד'),
    reflection: [
      bi(
        'Isolation rarely begins with a formal decision to withdraw. It can begin with one message left unanswered because the reply feels too complicated. Then another. Soon, contact itself carries the weight of explaining the whole absence.',
        'בידוד כמעט אף פעם אינו מתחיל בהחלטה רשמית להתרחק. הוא יכול להתחיל בהודעה אחת שלא ענינו עליה מפני שהתשובה הרגישה מסובכת מדי. אחר כך מגיעה עוד אחת. במהרה, עצם יצירת הקשר נושאת את המשקל של הסבר כל ההיעדרות.',
      ),
      bi(
        'Connection does not have to begin with a complete account. A small truthful signal can reopen the channel: “I am having a hard day. I do not need you to fix it. I wanted not to disappear.” The message does not settle the relationship. It changes whether you are carrying the moment alone.',
        'קשר אינו חייב להתחיל בדיווח מלא. אות קטן וכן יכול לפתוח מחדש את הערוץ: “עובר עליי יום קשה. אני לא צריך שתפתרו אותו. היה לי חשוב לא להיעלם.” ההודעה אינה מסדרת את הקשר. היא משנה את השאלה אם אתם נושאים את הרגע לבד.',
      ),
      bi(
        'Choose someone whose presence is usually safer than their advice. If no such person is available, a recovery contact, group, therapist or support line can be the first bridge. The size of the message should match the capacity available now.',
        'בחרו אדם שהנוכחות שלו בדרך כלל בטוחה יותר מן העצות שלו. אם אין אדם כזה, איש קשר מההחלמה, קבוצה, מטפל או קו תמיכה יכולים להיות הגשר הראשון. גודל ההודעה צריך להתאים ליכולת הזמינה כרגע.',
      ),
    ],
    coreSentence: bi('I do not have to explain everything in order not to be alone with it.', 'אני לא חייב להסביר הכול כדי לא להישאר עם זה לבד.'),
    actionTitle: bi('Send a message that asks for presence, not repair', 'לשלוח הודעה שמבקשת נוכחות, לא תיקון'),
    action: [
      bi('Choose one reasonably safe person or recovery contact.', 'בחרו אדם אחד שבדרך כלל מרגיש בטוח, או איש קשר מההחלמה.'),
      bi('Write one honest sentence and one clear request.', 'כתבו משפט כן אחד ובקשה ברורה אחת.'),
      bi('If sending feels impossible, save the draft and notice what made the threshold high.', 'אם השליחה מרגישה בלתי אפשרית, שמרו את הטיוטה ושימו לב מה הפך את הסף לגבוה.'),
    ],
    scientificLayer: bi('Social presence can alter threat appraisal, attention and available regulation. It is not a guarantee of relief, and relationship quality matters more than contact count.', 'נוכחות חברתית יכולה לשנות הערכת איום, קשב ויכולת ויסות. היא אינה מבטיחה הקלה, ואיכות הקשר חשובה יותר ממספר אנשי הקשר.'),
    therapyLayer: bi('Interpersonal effectiveness includes asking clearly, choosing timing and tolerating that another person may have limits. A request is not a demand, and a boundary is not automatic rejection.', 'יעילות בין־אישית כוללת בקשה ברורה, בחירת תזמון ויכולת לשאת את העובדה שגם לאדם האחר יש גבולות. בקשה אינה דרישה, וגבול אינו בהכרח דחייה.'),
    lovedOneLayer: bi('A concise answer can keep the channel open: “I am here. Do you want company, help with one practical thing, or just a check-in later?”', 'תשובה קצרה יכולה להשאיר את הערוץ פתוח: “אני כאן. תרצו שאהיה איתכם, שאעזור בדבר מעשי אחד, או שפשוט אבדוק מה שלומכם אחר כך?”'),
  },
  {
    title: bi('You can remove one decision', 'אפשר להסיר החלטה אחת'),
    reflection: [
      bi(
        'When the field is crowded, even small choices can become expensive. What to eat, whom to call, where to begin, whether to rest—each option asks for comparison, prediction and effort. The resulting paralysis is often mistaken for laziness, including by the person living through it.',
        'כשהשדה עמוס, גם בחירות קטנות יכולות להיות יקרות. מה לאכול, למי להתקשר, מאיפה להתחיל, אם לנוח — כל אפשרות דורשת השוואה, חיזוי ומאמץ. השיתוק שנוצר נתפס לעיתים כעצלנות, גם בעיני האדם שחווה אותו.',
      ),
      bi(
        'One way to widen action is not to add motivation but to remove a decision. Use the meal that already works. Put the shoes beside the door. Ask someone else to choose between two safe options. Repeat yesterday’s useful routine without demanding novelty.',
        'דרך אחת להרחיב את הפעולה אינה להוסיף מוטיבציה אלא להסיר החלטה. בחרו בארוחה שכבר עובדת. הניחו את הנעליים ליד הדלת. בקשו ממישהו אחר לבחור בין שתי אפשרויות בטוחות. חזרו על השגרה שהועילה אתמול בלי לדרוש מעצמכם חידוש.',
      ),
      bi(
        'This is not surrendering agency. It is using agency to redesign the decision environment. The goal is to preserve enough capacity for the choice that actually matters.',
        'זו אינה ויתור על יכולת הבחירה. זו הפעלה של יכולת הבחירה כדי לעצב מחדש את סביבת ההחלטה. המטרה היא לשמור מספיק כוח לבחירה שבאמת חשובה.',
      ),
    ],
    coreSentence: bi('I can use one decision now to make the next decision easier.', 'אני יכול להשתמש בהחלטה אחת עכשיו כדי להקל על ההחלטה הבאה.'),
    actionTitle: bi('Pre-decide one ordinary thing', 'לקבוע מראש דבר רגיל אחד'),
    action: [
      bi('Find one repeated decision that drains energy today.', 'מצאו החלטה חוזרת אחת שגוזלת היום אנרגיה.'),
      bi('Choose a safe default for this day only.', 'בחרו ברירת מחדל בטוחה ליום הזה בלבד.'),
      bi('Place what you need where the action begins.', 'הניחו את מה שצריך בדיוק במקום שבו הפעולה מתחילה.'),
    ],
    scientificLayer: bi('Executive demand is state-dependent. Defaults and environmental cues can reduce the number of operations required before action begins.', 'הדרישה ממערכות ניהוליות תלויה במצב. ברירות מחדל ורמזים סביבתיים יכולים להפחית את מספר השלבים שנדרשים לפני שמתחילים לפעול.'),
    therapyLayer: bi('Behavioral planning often works by making the desired action more concrete and the first step smaller. It should support agency, not become another rigid rule.', 'תכנון התנהגותי פועל לעיתים באמצעות הפיכת הפעולה הרצויה למוחשית יותר והקטנת הצעד הראשון. עליו לתמוך ביכולת הפעולה, לא להפוך לעוד כלל נוקשה.'),
    lovedOneLayer: bi('Practical help can reduce decisions without taking over: offer two clear options, then respect the answer.', 'עזרה מעשית יכולה להפחית החלטות בלי להשתלט: הציעו שתי אפשרויות ברורות, ואז כבדו את התשובה.'),
  },
  {
    title: bi('A difficult feeling does not need a courtroom', 'רגש קשה אינו זקוק לבית משפט'),
    reflection: [
      bi(
        'Pain often arrives with a second task: prove that you are allowed to feel it. The mind gathers evidence, argues with imagined objections and searches for a verdict. By the time the trial ends, the original feeling is still present and the system is carrying the trial as well.',
        'כאב מגיע לעיתים עם משימה נוספת: להוכיח שמותר לכם להרגיש אותו. הראש אוסף ראיות, מתווכח עם התנגדויות מדומיינות ומחפש פסק דין. כשהמשפט מסתיים, הרגש המקורי עדיין נמצא שם — ועכשיו המערכת נושאת גם את המשפט.',
      ),
      bi(
        'Recognition is smaller than explanation. “This hurts.” “I am ashamed.” “I am angry and tired.” A sentence like this does not establish who is right, what should happen or what the feeling means about you. It simply stops requiring the feeling to earn admission.',
        'הכרה קטנה יותר מהסבר. “זה כואב.” “אני מתבייש.” “אני כועס ועייף.” משפט כזה אינו קובע מי צודק, מה צריך לקרות או מה הרגש אומר עליכם. הוא פשוט מפסיק לדרוש מן הרגש להרוויח את הזכות להיכנס.',
      ),
      bi(
        'After recognition, action may become clearer: speak, wait, leave the room, ask for help or do nothing for five minutes. The feeling is information, not an order. It can be present without becoming the only authority in the field.',
        'אחרי ההכרה, הפעולה עשויה להתבהר: לדבר, להמתין, לצאת מהחדר, לבקש עזרה או לא לעשות דבר במשך חמש דקות. הרגש הוא מידע, לא פקודה. הוא יכול להיות נוכח בלי להפוך לסמכות היחידה בשדה.',
      ),
    ],
    coreSentence: bi('I can acknowledge what I feel without turning it into a verdict about me.', 'אני יכול להכיר במה שאני מרגיש בלי להפוך אותו לפסק דין עליי.'),
    actionTitle: bi('Name, locate, choose', 'לתת שם, למצוא בגוף, לבחור'),
    action: [
      bi('Name the feeling with one ordinary word.', 'תנו לרגש שם במילה פשוטה אחת.'),
      bi('Notice where it is most evident in the body.', 'שימו לב היכן הוא מורגש בצורה הברורה ביותר בגוף.'),
      bi('Choose one action that does not require the feeling to vanish first.', 'בחרו פעולה אחת שאינה דורשת שהרגש ייעלם קודם.'),
    ],
    scientificLayer: bi('Affective labeling has been studied as one way attention and emotional processing can change. Effects are variable; naming is a tool, not a neurological switch.', 'מתן שם לרגש נחקר כאחת הדרכים שבהן קשב ועיבוד רגשי יכולים להשתנות. ההשפעה משתנה; מתן שם הוא כלי, לא מתג נוירולוגי.'),
    therapyLayer: bi('Acceptance-based work distinguishes willingness from approval. Making room for an emotion does not mean agreeing with every story or impulse attached to it.', 'עבודה מבוססת קבלה מבחינה בין נכונות לחוות לבין הסכמה. לפנות מקום לרגש אינו אומר להסכים עם כל סיפור או דחף שנלווים אליו.'),
    lovedOneLayer: bi('Validation can be simple and bounded: “I can understand why this hurts.” It does not require endorsing harmful behavior or abandoning your own limits.', 'תיקוף יכול להיות פשוט ומוגבל: “אני יכול להבין למה זה כואב.” הוא אינו מחייב להסכים להתנהגות פוגעת או לוותר על הגבולות שלכם.'),
  },
];

function dayNumber(date: string): number {
  const parsed = new Date(`${date}T12:00:00Z`);
  return Math.floor(parsed.getTime() / 86_400_000);
}

export function getHereNowEntry(date = new Date().toISOString().slice(0, 10)): HereNowEntry {
  const index = Math.abs(dayNumber(date)) % entries.length;
  const entry = entries[index] ?? entries[0];
  if (!entry) throw new Error('Here and Now fallback content is unavailable');
  return { ...entry, date };
}
