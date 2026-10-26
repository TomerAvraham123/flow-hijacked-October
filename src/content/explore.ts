import type { ContentDestination } from '@/types/content';
import type { Bilingual } from '@/types/recovery';

const bi = (en: string, he: string): Bilingual => ({ en, he });

export interface EditorialSection {
  id: string;
  title: Bilingual;
  paragraphs: Bilingual[];
  note?: Bilingual;
}

export interface EditorialDocument extends ContentDestination {
  slug: string;
  eyebrow: Bilingual;
  sections: EditorialSection[];
  references: { title: Bilingual; detail: Bilingual }[];
}

export interface ExploreEntry extends ContentDestination {
  href: string;
  eyebrow: Bilingual;
}

export interface NeuromodulatorEntry {
  id: 'dopamine' | 'serotonin' | 'noradrenaline' | 'glutamate' | 'gaba';
  name: Bilingual;
  origin: Bilingual;
  destinations: Bilingual[];
  role: Bilingual;
  recoveryLens: Bilingual;
  boundary: Bilingual;
}

export interface ResearchTopic extends ContentDestination {
  question: Bilingual;
  whatItSupports: Bilingual;
  whatItDoesNotSupport: Bilingual;
  whyItMatters: Bilingual;
}

const recoveryDynamics: EditorialDocument = {
  id: 'reading-recovery-dynamics',
  slug: 'recovery-as-a-dynamic-system',
  kind: 'lecture',
  title: bi('Recovery as a dynamic system', 'החלמה כמערכת דינמית'),
  subtitle: bi(
    'Why a difficult moment is not the whole trajectory',
    'למה רגע קשה אינו כל המסלול',
  ),
  eyebrow: bi('Gateway lecture', 'הרצאת מבוא'),
  canonicalPath: '/lectures/26-healing-re-expansion',
  readingMinutes: 12,
  sections: [
    {
      id: 'state-not-self',
      title: bi('A state is not a self', 'מצב אינו זהות'),
      paragraphs: [
        bi(
          'Recovery is often described as if a person were moving up or down a single ladder. Human systems do not behave that way. Sleep, stress, bodily energy, relationships, cues, meaning and access to support interact. A shift in one part can narrow the options available elsewhere without defining the person who is moving through it.',
          'לעיתים מדברים על החלמה כאילו האדם מטפס או יורד בסולם אחד. מערכות אנושיות אינן פועלות כך. שינה, לחץ, אנרגיה גופנית, קשרים, רמזים מהסביבה, משמעות וגישה לתמיכה משפיעים זה על זה. שינוי בחלק אחד יכול לצמצם את האפשרויות במקום אחר, בלי להגדיר את האדם שעובר בתוך המצב הזה.',
        ),
        bi(
          'The Flow Hijacked lens treats the present as a temporary configuration: real, consequential and worthy of attention, but not a verdict. That distinction matters most when the field feels compressed. It allows us to ask what remains reachable instead of asking whether recovery has succeeded or failed.',
          'העדשה של Flow Hijacked מתייחסת להווה כאל תצורה זמנית: היא אמיתית, יש לה השלכות, וראוי להתייחס אליה — אבל היא אינה פסק דין. ההבחנה הזאת חשובה במיוחד כשהשדה מרגיש דחוס. היא מאפשרת לשאול מה עדיין נגיש, במקום לשאול אם ההחלמה הצליחה או נכשלה.',
        ),
      ],
    },
    {
      id: 'attractors',
      title: bi('Attractors without fatalism', 'מושכים, בלי גורל קבוע מראש'),
      paragraphs: [
        bi(
          'In dynamical systems, an attractor is a region toward which trajectories tend to return under particular conditions. In lived recovery, familiar loops can behave attractor-like: the same cue, fatigue and isolation may repeatedly organize attention and action in a similar direction. The metaphor is useful only if we preserve its humility. It does not mean the future is fixed, and it is not literal brain imaging.',
          'במערכות דינמיות, מושך הוא אזור שמסלולים נוטים לחזור אליו בתנאים מסוימים. בחיים עצמם, לולאות מוכרות יכולות להתנהג באופן דומה: אותו רמז, עייפות ובידוד עשויים לארגן שוב ושוב את הקשב והפעולה באותו כיוון. המטאפורה מועילה רק אם שומרים על צניעות. היא אינה אומרת שהעתיד קבוע, והיא בוודאי אינה צילום של המוח.',
        ),
        bi(
          'A small intervention can matter because it changes the conditions under which the next transition occurs. Moving rooms, eating, contacting someone or reducing one immediate cue may look modest from outside. Inside a constrained field, it can open a corridor that did not feel available a minute earlier.',
          'התערבות קטנה יכולה להיות חשובה מפני שהיא משנה את התנאים שבהם יתרחש המעבר הבא. לעבור לחדר אחר, לאכול, ליצור קשר עם אדם אחד או להרחיק רמז מיידי עשויים להיראות צנועים מבחוץ. בתוך שדה מצומצם, הם יכולים לפתוח מעבר שלפני דקה כלל לא הרגיש זמין.',
        ),
      ],
      note: bi(
        'The visual field in this app is an explanatory map of entries—not a clinical measurement.',
        'השדה החזותי באפליקציה הוא מפה שמסבירה את הרשומות — לא מדידה קלינית.',
      ),
    },
    {
      id: 'next-step',
      title: bi('Why one accessible step can be enough', 'למה צעד נגיש אחד יכול להספיק'),
      paragraphs: [
        bi(
          'When capacity is low, asking for a complete plan can become another source of pressure. A better question is: which action has the lowest entry cost and a plausible chance of changing the immediate configuration? The best next step is not the most impressive intervention. It is the one that can actually begin from here.',
          'כשהיכולת לפעול נמוכה, בקשה לתוכנית שלמה עלולה להפוך לעוד מקור לחץ. שאלה מועילה יותר היא: לאיזו פעולה יש את סף הכניסה הנמוך ביותר, ועדיין יש סיכוי סביר שתשנה משהו בתצורה המיידית? הצעד הבא אינו ההתערבות המרשימה ביותר. הוא הדבר שאפשר באמת להתחיל ממנו כאן.',
        ),
      ],
    },
  ],
  references: [
    {
      title: bi('Nonlinear dynamics and metastability', 'דינמיקה לא־ליניארית ומטא־יציבות'),
      detail: bi('Conceptual foundation used across the Flow Hijacked lecture series.', 'בסיס מושגי המשמש לאורך סדרת ההרצאות של Flow Hijacked.'),
    },
    {
      title: bi('Recovery ecology and control', 'אקולוגיה של החלמה ובקרה'),
      detail: bi('Flow Hijacked synthesis; not a diagnostic model.', 'סינתזה של Flow Hijacked; לא מודל אבחוני.'),
    },
  ],
};

const tomorrowCannotCompete: EditorialDocument = {
  id: 'reading-tomorrow',
  slug: 'when-tomorrow-cannot-compete',
  kind: 'lecture',
  title: bi('When tomorrow cannot compete', 'כשהמחר אינו מצליח להתחרות'),
  subtitle: bi('Craving, temporal compression and the shrinking future', 'דחף, דחיסת זמן והעתיד שמצטמצם'),
  eyebrow: bi('Lecture 42 · addiction and time', 'הרצאה 42 · התמכרות וזמן'),
  canonicalPath: '/lectures/42-when-tomorrow-cannot-compete',
  readingMinutes: 15,
  sections: [
    {
      id: 'present-weight',
      title: bi('When the present gains too much weight', 'כשההווה מקבל משקל גדול מדי'),
      paragraphs: [
        bi(
          'Craving is not merely wanting something strongly. It can reorganize time. Immediate relief becomes vivid and concrete while tomorrow loses detail, emotional force and bargaining power. The person may still know what matters later, yet that knowledge no longer competes on equal terms with the present cue.',
          'דחף אינו רק רצון חזק מאוד. הוא יכול לארגן מחדש את הזמן. ההקלה המיידית נעשית חיה ומוחשית, בעוד שהמחר מאבד פרטים, כוח רגשי ויכולת להתחרות. האדם עדיין עשוי לדעת מה חשוב לו בהמשך, אבל הידיעה הזאת כבר אינה מתחרה בתנאים שווים ברמז שנמצא מולו עכשיו.',
        ),
        bi(
          'This is one reason moral language so often fails. It assumes all options remain equally represented and that choice occurs in a neutral field. A dynamical account asks instead what compressed the horizon and what could make one additional future option feel real again.',
          'זאת אחת הסיבות ששפה מוסרנית נכשלת לעיתים קרובות כל כך. היא מניחה שכל האפשרויות עדיין מיוצגות באותה מידה, ושהבחירה נעשית בשדה ניטרלי. מבט דינמי שואל במקום זאת מה דחס את האופק, ומה יכול להפוך אפשרות עתידית אחת לממשית שוב.',
        ),
      ],
    },
    {
      id: 'circuits',
      title: bi('A circuit-level interpretation', 'פרשנות ברמת המעגלים'),
      paragraphs: [
        bi(
          'Reward-learning systems, hippocampal context, salience processing and prefrontal control participate in how value is assigned across time. They are not independent switches. Their interaction changes with stress, sleep, withdrawal, cues and learned expectations. No single region is “the addiction centre.”',
          'מערכות למידת תגמול, ההקשר שמספק ההיפוקמפוס, עיבוד בולטות ובקרה קדם־מצחית משתתפים באופן שבו ערך מתחלק על פני הזמן. אלה אינם מתגים נפרדים. האינטראקציה ביניהם משתנה עם לחץ, שינה, גמילה, רמזים וציפיות שנלמדו. אין אזור יחיד שהוא “מרכז ההתמכרות”.',
        ),
      ],
    },
    {
      id: 'restore-future',
      title: bi('Making a small piece of the future available', 'להחזיר חתיכה קטנה מן העתיד'),
      paragraphs: [
        bi(
          'In a compressed moment, “think about your whole life” is usually too large. A nearer future may be more useful: the next ten minutes, the person who can stay on the phone, the place with fewer cues, the meal that changes bodily load. The aim is not perfect foresight. It is to restore enough temporal width for another action to enter the competition.',
          'ברגע דחוס, “לחשוב על כל החיים” היא בדרך כלל דרישה גדולה מדי. עתיד קרוב יותר עשוי להיות מועיל: עשר הדקות הבאות, האדם שיכול להישאר על הקו, המקום שבו יש פחות רמזים, הארוחה שתשנה את העומס הגופני. המטרה אינה ראיית עתיד מושלמת. המטרה היא להחזיר מספיק רוחב לזמן, כדי שעוד פעולה תוכל להיכנס לתחרות.',
        ),
      ],
    },
  ],
  references: [
    {
      title: bi('Temporal discounting and reward learning', 'היוון זמן ולמידת תגמול'),
      detail: bi('Established research domains; interpretation is deliberately non-diagnostic.', 'תחומי מחקר מבוססים; הפרשנות כאן אינה אבחונית.'),
    },
  ],
};

const trustAfterAddiction: EditorialDocument = {
  id: 'reading-trust',
  slug: 'trust-after-addiction',
  kind: 'lecture',
  title: bi('Trust after addiction', 'אמון אחרי התמכרות'),
  subtitle: bi('Repair as repeated evidence, not a demanded feeling', 'תיקון כראיות חוזרות, לא כרגש שאפשר לדרוש'),
  eyebrow: bi('Lecture 45 · relationships', 'הרצאה 45 · קשרים'),
  canonicalPath: '/lectures/trust-after-addiction',
  readingMinutes: 14,
  sections: [
    {
      id: 'two-realities',
      title: bi('Two realities can be true', 'שתי מציאויות יכולות להיות נכונות'),
      paragraphs: [
        bi(
          'A person in recovery may be making a sincere effort while someone close to them remains watchful, tired or frightened. The effort is real. So is the nervous system that learned not to relax around promises. Repair becomes more humane when neither reality is used to erase the other.',
          'אדם שנמצא בהחלמה יכול להתאמץ בכנות, ובאותו זמן אדם קרוב אליו עדיין יהיה דרוך, עייף או מפוחד. המאמץ אמיתי. גם מערכת העצבים שלמדה לא להירגע מול הבטחות היא אמיתית. התיקון נעשה אנושי יותר כשאף אחת מן המציאויות אינה משמשת למחיקת האחרת.',
        ),
      ],
    },
    {
      id: 'evidence',
      title: bi('Trust grows from legible evidence', 'אמון גדל מתוך ראיות שאפשר לראות'),
      paragraphs: [
        bi(
          'Trust cannot be argued back into existence. It is updated through small, repeated and understandable events: saying what will happen, doing it, naming a change early, tolerating a boundary and repairing after a miss. Consistency matters, but perfection is not the criterion. Legibility is.',
          'אי אפשר לשכנע אמון לחזור. הוא מתעדכן דרך אירועים קטנים, חוזרים ומובנים: לומר מה עומד לקרות, לעשות זאת, להודיע מוקדם כשמשהו משתנה, לכבד גבול ולתקן אחרי פספוס. עקביות חשובה, אבל שלמות אינה תנאי. היכולת של האחר להבין מה קורה — כן.',
        ),
      ],
    },
    {
      id: 'boundaries',
      title: bi('A boundary is information and protection', 'גבול הוא מידע והגנה'),
      paragraphs: [
        bi(
          'A loved one does not owe immediate trust as proof of support. A boundary can protect both people from returning to a pattern that neither wants. Recovery work and relationship repair overlap, but they are not the same timeline and cannot be forced into synchrony.',
          'אדם קרוב אינו חייב לתת אמון מיד כדי להוכיח שהוא תומך. גבול יכול להגן על שני האנשים מחזרה לדפוס שאף אחד מהם אינו רוצה. עבודת ההחלמה ותיקון הקשר חופפים, אבל הם אינם נעים באותו לוח זמנים, ואי אפשר לכפות עליהם להסתנכרן.',
        ),
      ],
    },
  ],
  references: [
    {
      title: bi('Attachment, learning and relational repair', 'התקשרות, למידה ותיקון ביחסים'),
      detail: bi('A synthesis for people in recovery, loved ones and therapists.', 'סינתזה לאנשים בהחלמה, לקרובים ולאנשי טיפול.'),
    },
  ],
};

const frameworkJourney: EditorialDocument = {
  id: 'reading-framework',
  slug: 'framework-and-journey',
  kind: 'concept',
  title: bi('The framework and the human journey', 'המסגרת והדרך האנושית'),
  subtitle: bi('Science in service of a larger, more compassionate account', 'מדע בשירות תמונה רחבה ואנושית יותר'),
  eyebrow: bi('About Flow Hijacked', 'על Flow Hijacked'),
  canonicalPath: '/about',
  readingMinutes: 10,
  sections: [
    {
      id: 'why',
      title: bi('Why Flow Hijacked exists', 'למה Flow Hijacked קיים'),
      paragraphs: [
        bi(
          'Flow Hijacked began from a dissatisfaction with explanations that were either scientifically thin or emotionally remote. Addiction, depression and recovery deserve serious neuroscience, mathematics and clinical thought. They also deserve language that remembers a person is living inside the system being described.',
          'Flow Hijacked נולד מתוך אי־נחת מהסברים שהיו דלים מבחינה מדעית או רחוקים מבחינה רגשית. התמכרות, דיכאון והחלמה ראויים למדעי מוח רציניים, למתמטיקה ולחשיבה קלינית. הם גם ראויים לשפה שזוכרת שבתוך המערכת המתוארת חי אדם.',
        ),
      ],
    },
    {
      id: 'lens',
      title: bi('A lens, not a total theory', 'עדשה, לא תאוריה שמסבירה הכול'),
      paragraphs: [
        bi(
          'The framework connects nonlinear dynamics, predictive processing, learning, social ecology, psychotherapy and lived experience. Its value lies in the connections it makes available. It should not be mistaken for a validated diagnostic instrument or a replacement for care.',
          'המסגרת מחברת בין דינמיקה לא־ליניארית, עיבוד מנבא, למידה, אקולוגיה חברתית, פסיכותרפיה וניסיון חיים. הערך שלה נמצא בקשרים שהיא מאפשרת לראות. אין להתייחס אליה ככלי אבחוני מאומת או כתחליף לטיפול.',
        ),
      ],
    },
    {
      id: 'agency',
      title: bi('Agency without blame', 'יכולת פעולה בלי אשמה'),
      paragraphs: [
        bi(
          'Compassion does not require pretending that actions have no consequences. Agency does not require pretending that every option was equally available. Holding both ideas together creates a more useful place from which responsibility, support and change can begin.',
          'חמלה אינה מחייבת להעמיד פנים שלמעשים אין השלכות. יכולת פעולה אינה מחייבת להעמיד פנים שכל האפשרויות היו זמינות באותה מידה. כשמחזיקים את שני הרעיונות יחד, נוצר מקום מועיל יותר שממנו אחריות, תמיכה ושינוי יכולים להתחיל.',
        ),
      ],
    },
  ],
  references: [
    {
      title: bi('Flow Hijacked lecture and research corpus', 'קורפוס ההרצאות והמחקר של Flow Hijacked'),
      detail: bi('The framework evolves as evidence and understanding change.', 'המסגרת ממשיכה להתפתח כשהראיות וההבנה משתנות.'),
    },
  ],
};

export const readingDocuments: Record<string, EditorialDocument> = {
  [recoveryDynamics.slug]: recoveryDynamics,
  [tomorrowCannotCompete.slug]: tomorrowCannotCompete,
  [trustAfterAddiction.slug]: trustAfterAddiction,
  [frameworkJourney.slug]: frameworkJourney,
};

export const lectureDocuments = [recoveryDynamics, tomorrowCannotCompete, trustAfterAddiction];

export const therapyDocuments: Record<string, EditorialDocument> = {
  act: {
    id: 'therapy-act',
    slug: 'act',
    kind: 'therapy',
    title: bi('Acceptance and Commitment Therapy', 'טיפול בקבלה ומחויבות — ACT'),
    subtitle: bi('Making room for experience while moving toward what matters', 'לפנות מקום לחוויה, ובו בזמן לנוע לעבר מה שחשוב'),
    eyebrow: bi('Therapy route', 'מסלול טיפולי'),
    canonicalPath: '/psychotherapy/acceptance-commitment-therapy',
    readingMinutes: 9,
    sections: [
      {
        id: 'aim',
        title: bi('The central move', 'התנועה המרכזית'),
        paragraphs: [
          bi(
            'ACT does not ask a person to approve of pain or stop wanting relief. It helps loosen the rule that difficult thoughts and feelings must disappear before meaningful action can begin. Attention shifts from winning an internal argument to increasing behavioral flexibility.',
            'ACT אינו מבקש מאדם להסכים לכאב או להפסיק לרצות הקלה. הוא עוזר לרכך את הכלל שלפיו מחשבות ורגשות קשים חייבים להיעלם לפני שאפשר להתחיל לפעול בכיוון משמעותי. הקשב עובר מניסיון לנצח ויכוח פנימי להרחבת הגמישות ההתנהגותית.',
          ),
        ],
      },
      {
        id: 'field',
        title: bi('Through the field lens', 'מבעד לעדשת השדה'),
        paragraphs: [
          bi(
            'Experiential avoidance can narrow a field by making every action conditional on feeling different first. Defusion, present-moment attention, values and committed action can create another route through the same state. The state may remain uncomfortable while the available action space grows.',
            'הימנעות מחוויה יכולה לצמצם את השדה כשהיא הופכת כל פעולה לתלויה בכך שנרגיש אחרת קודם. התרחקות מהמחשבה בלי להילחם בה, קשב להווה, ערכים ופעולה מחויבת יכולים ליצור נתיב נוסף בתוך אותו מצב. ייתכן שהמצב יישאר לא נעים, ובכל זאת מרחב הפעולה יתרחב.',
          ),
        ],
      },
      {
        id: 'fit',
        title: bi('When it may fit—and what it is not', 'מתי זה עשוי להתאים — ומה זה לא'),
        paragraphs: [
          bi(
            'ACT can be useful when struggle with internal experience has itself become costly. It is not passive resignation, forced positivity or a demand to tolerate unsafe conditions. In addiction treatment it is often integrated with relapse prevention, medical care, community support and other therapies.',
            'ACT עשוי לעזור כשהמאבק בחוויה הפנימית עצמו כבר גובה מחיר. זו אינה כניעה פסיבית, חשיבה חיובית בכוח או דרישה להישאר בתנאים לא בטוחים. בטיפול בהתמכרות משלבים אותו לעיתים קרובות עם מניעת מעידה, טיפול רפואי, תמיכה קהילתית ושיטות טיפול נוספות.',
          ),
        ],
      },
    ],
    references: [{ title: bi('ACT evidence base', 'בסיס הראיות של ACT'), detail: bi('Evidence varies by condition, outcome and comparison treatment.', 'עוצמת הראיות משתנה לפי מצב, תוצאה וטיפול ההשוואה.') }],
  },
  dbt: {
    id: 'therapy-dbt',
    slug: 'dbt',
    kind: 'therapy',
    title: bi('Dialectical Behavior Therapy', 'טיפול דיאלקטי־התנהגותי — DBT'),
    subtitle: bi('Acceptance and change held in the same treatment', 'קבלה ושינוי שמוחזקים יחד בתוך הטיפול'),
    eyebrow: bi('Therapy route', 'מסלול טיפולי'),
    canonicalPath: '/psychotherapy/dialectical-behavior-therapy',
    readingMinutes: 10,
    sections: [
      {
        id: 'dialectic',
        title: bi('The dialectic', 'העמדה הדיאלקטית'),
        paragraphs: [
          bi(
            'DBT begins with a demanding combination: the person makes sense in context, and change is still necessary. Validation is not agreement with every action. It is an effort to understand how that action became available in that moment, so that other actions can be built.',
            'DBT מתחיל בשילוב לא פשוט: אפשר להבין את האדם בתוך ההקשר שלו, ובו בזמן עדיין דרוש שינוי. תיקוף אינו הסכמה עם כל פעולה. זהו ניסיון להבין כיצד הפעולה הזאת נעשתה זמינה באותו רגע, כדי שאפשר יהיה לבנות פעולות נוספות.',
          ),
        ],
      },
      {
        id: 'skills',
        title: bi('Skills as added degrees of freedom', 'מיומנויות שמוסיפות אפשרויות פעולה'),
        paragraphs: [
          bi(
            'Mindfulness, distress tolerance, emotion regulation and interpersonal effectiveness are not tests of character. They are rehearsed responses that can remain more reachable under load. Repetition matters because a skill that exists only in calm conditions may disappear when the field compresses.',
            'קשיבות, סבילות למצוקה, ויסות רגשי ויעילות בין־אישית אינן מבחני אופי. אלה תגובות שמתאמנים עליהן כדי שיוכלו להישאר נגישות יותר תחת עומס. החזרה חשובה, מפני שמיומנות שקיימת רק כשהכול רגוע עלולה להיעלם כשהשדה מצטמצם.',
          ),
        ],
      },
      {
        id: 'structure',
        title: bi('Treatment structure matters', 'גם למבנה הטיפול יש חשיבות'),
        paragraphs: [
          bi(
            'Full DBT is more than a collection of coping tips. It includes a treatment hierarchy, individual work, skills training and consultation structures. Adapted skills can still help, but they should not be mislabeled as the complete treatment.',
            'DBT מלא הוא הרבה מעבר לאוסף עצות להתמודדות. הוא כולל סדר עדיפויות טיפולי, עבודה פרטנית, אימון במיומנויות ומבני התייעצות. אפשר להיעזר גם במיומנויות מותאמות, אבל חשוב לא להציג אותן כאילו הן הטיפול המלא.',
          ),
        ],
      },
    ],
    references: [{ title: bi('DBT treatment model', 'מודל הטיפול של DBT'), detail: bi('A structured therapy with condition-specific evidence.', 'טיפול מובנה עם בסיס ראיות שמשתנה לפי המצב הנבדק.') }],
  },
  'motivational-interviewing': {
    id: 'therapy-mi',
    slug: 'motivational-interviewing',
    kind: 'therapy',
    title: bi('Motivational Interviewing', 'ראיון מוטיבציוני'),
    subtitle: bi('Working with ambivalence without turning it into a moral failure', 'לעבוד עם אמביוולנטיות בלי להפוך אותה לכישלון מוסרי'),
    eyebrow: bi('Therapy route', 'מסלול טיפולי'),
    canonicalPath: '/psychotherapy/motivational-relapse-contingency',
    readingMinutes: 8,
    sections: [
      {
        id: 'ambivalence',
        title: bi('Ambivalence contains information', 'אמביוולנטיות מכילה מידע'),
        paragraphs: [
          bi(
            'A person can want change and still experience the addictive behavior as relief, belonging, protection or the only reliable transition out of an unbearable state. Motivational Interviewing does not crush that conflict with persuasion. It helps the person hear their own reasons for movement while preserving autonomy.',
            'אדם יכול לרצות שינוי ובאותו זמן לחוות את ההתנהגות הממכרת כהקלה, שייכות, הגנה או הדרך היחידה לצאת ממצב בלתי נסבל. ראיון מוטיבציוני אינו מוחץ את הקונפליקט באמצעות שכנוע. הוא עוזר לאדם לשמוע את הסיבות שלו לתנועה, תוך שמירה על האוטונומיה שלו.',
          ),
        ],
      },
      {
        id: 'language',
        title: bi('Language that opens rather than corners', 'שפה שפותחת במקום לדחוק לפינה'),
        paragraphs: [
          bi(
            'Open questions, reflections, affirmations and summaries are used strategically, not mechanically. The aim is not to make someone say the correct sentence. It is to reduce defensiveness, clarify discrepancy and support language that the person can own.',
            'שאלות פתוחות, שיקופים, חיזוקים וסיכומים משמשים באופן מכוון, לא מכני. המטרה אינה לגרום למישהו לומר את המשפט הנכון. המטרה היא להפחית התגוננות, להבהיר את הפער ולתמוך בשפה שהאדם יכול להרגיש שהיא באמת שלו.',
          ),
        ],
      },
    ],
    references: [{ title: bi('Motivational Interviewing', 'ראיון מוטיבציוני'), detail: bi('Often integrated with broader addiction treatment.', 'משולב לעיתים קרובות בתוך טיפול רחב יותר בהתמכרות.') }],
  },
};

export const neuromodulators: NeuromodulatorEntry[] = [
  {
    id: 'dopamine',
    name: bi('Dopamine', 'דופמין'),
    origin: bi('Midbrain nuclei, including VTA and substantia nigra', 'גרעינים במוח האמצעי, ובהם VTA והחומר השחור'),
    destinations: [bi('Ventral striatum / NAc', 'הסטריאטום הגחוני / NAc'), bi('Prefrontal cortex', 'קליפת המוח הקדם־מצחית'), bi('Dorsal striatum', 'הסטריאטום הגבי')],
    role: bi('Learning, salience, movement, effort and updating expected value—not a simple pleasure chemical.', 'למידה, בולטות, תנועה, מאמץ ועדכון ערך צפוי — לא “חומר הכיף” של המוח.'),
    recoveryLens: bi('Repeated cue–action learning can make some transitions fast and dominant. Recovery involves new learning and changed conditions, not “restoring dopamine to 100%.”', 'למידה חוזרת של קשר בין רמז לפעולה יכולה להפוך מעברים מסוימים למהירים ודומיננטיים. החלמה כוללת למידה חדשה ושינוי תנאים, לא “החזרת הדופמין למאה אחוז”.'),
    boundary: bi('Dopamine signals differ across pathways, timescales and receptor populations.', 'האות הדופמינרגי שונה בין מסלולים, טווחי זמן וסוגי קולטנים.'),
  },
  {
    id: 'serotonin',
    name: bi('Serotonin', 'סרוטונין'),
    origin: bi('Raphe nuclei in the brainstem', 'גרעיני הראפה בגזע המוח'),
    destinations: [bi('Cortex', 'קליפת המוח'), bi('Limbic regions', 'אזורים לימביים'), bi('Hypothalamus and brainstem', 'היפותלמוס וגזע המוח')],
    role: bi('Broad modulation of mood, patience, aversive processing, sleep, appetite and flexibility across many receptor families.', 'ויסות רחב של מצב רוח, סבלנות, עיבוד שלילי, שינה, תיאבון וגמישות — באמצעות משפחות רבות של קולטנים.'),
    recoveryLens: bi('Its relevance cannot be reduced to “low serotonin.” Treatment effects emerge across receptors, circuits, adaptation and context.', 'אי אפשר לצמצם את הרלוונטיות שלו ל“סרוטונין נמוך”. השפעות טיפוליות נוצרות דרך קולטנים, מעגלים, הסתגלות והקשר.'),
    boundary: bi('A transmitter level is not a direct reading of a person’s mood.', 'רמת מוליך עצבי אינה קריאה ישירה של מצב הרוח של אדם.'),
  },
  {
    id: 'noradrenaline',
    name: bi('Noradrenaline', 'נוראדרנלין'),
    origin: bi('Locus coeruleus and related brainstem nuclei', 'ה־locus coeruleus וגרעינים נוספים בגזע המוח'),
    destinations: [bi('Widespread cortex', 'אזורים נרחבים בקליפת המוח'), bi('Hippocampus', 'היפוקמפוס'), bi('Amygdala', 'אמיגדלה')],
    role: bi('Arousal, vigilance, uncertainty, gain control and rapid reorientation.', 'עוררות, דריכות, אי־ודאות, ויסות עוצמת האות והסטה מהירה של קשב.'),
    recoveryLens: bi('Too little or too much arousal can narrow useful action in different ways. Regulation is not synonymous with sedation.', 'מעט מדי או הרבה מדי עוררות יכולים לצמצם פעולה מועילה בדרכים שונות. ויסות אינו מילה נרדפת להרגעה תרופתית.'),
    boundary: bi('The same signal can have different effects by receptor, region and baseline state.', 'לאותו אות עשויות להיות השפעות שונות לפי הקולטן, האזור ומצב הבסיס.'),
  },
  {
    id: 'glutamate',
    name: bi('Glutamate', 'גלוטמט'),
    origin: bi('Distributed excitatory neurons throughout cortex and subcortex', 'נוירונים מעוררים הפזורים בקליפת המוח ובאזורים תת־קליפתיים'),
    destinations: [bi('Cortico-striatal loops', 'לולאות קורטיקו־סטריאטליות'), bi('Hippocampal circuits', 'מעגלי ההיפוקמפוס'), bi('Cortical networks', 'רשתות קורטיקליות')],
    role: bi('The principal excitatory transmitter; central to plasticity, learning and network communication.', 'המוליך המעורר המרכזי; חיוני לפלסטיות, למידה ותקשורת בין רשתות.'),
    recoveryLens: bi('Adaptation in glutamatergic learning systems is relevant to cue reactivity, habit and extinction. “More” is not inherently better.', 'הסתגלות במערכות למידה גלוטמטרגיות רלוונטית לתגובה לרמזים, הרגל והכחדה. “יותר” אינו בהכרח טוב יותר.'),
    boundary: bi('Excitation is a network function, not an emotional label.', 'עוררות עצבית היא תפקוד של רשת, לא תווית רגשית.'),
  },
  {
    id: 'gaba',
    name: bi('GABA', 'GABA'),
    origin: bi('Distributed inhibitory interneurons and projection systems', 'אינטרנוירונים מעכבים ומערכות הקרנה הפזורים במוח'),
    destinations: [bi('Local cortical circuits', 'מעגלים מקומיים בקליפת המוח'), bi('Basal ganglia', 'גרעיני הבסיס'), bi('Cerebellar and limbic circuits', 'מעגלים צרבלריים ולימביים')],
    role: bi('The principal inhibitory transmitter; shapes timing, stability and competition between neural populations.', 'המוליך המעכב המרכזי; מעצב תזמון, יציבות ותחרות בין אוכלוסיות עצביות.'),
    recoveryLens: bi('Alcohol and several sedatives interact with GABA systems, but dependence and withdrawal involve wider adaptations and can require medical care.', 'אלכוהול וכמה תרופות מרגיעות פועלים על מערכות GABA, אך תלות וגמילה כוללות הסתגלויות רחבות יותר ולעיתים דורשות טיפול רפואי.'),
    boundary: bi('Abrupt withdrawal from alcohol or sedatives can be dangerous; this material is not withdrawal guidance.', 'גמילה פתאומית מאלכוהול או מתרופות מרגיעות עלולה להיות מסוכנת; החומר כאן אינו הנחיה לגמילה.'),
  },
];

export const researchTopics: ResearchTopic[] = [
  {
    id: 'research-predictive-processing',
    kind: 'research',
    title: bi('Predictive processing and interoception', 'עיבוד מנבא ואינטרוספציה'),
    subtitle: bi('How expectations and bodily signals may shape what becomes salient', 'כיצד ציפיות ואותות מן הגוף עשויים לעצב את מה שנעשה בולט'),
    canonicalPath: '/research',
    readingMinutes: 7,
    question: bi('How do prior expectations and bodily states alter perception, craving and action?', 'כיצד ציפיות מוקדמות ומצבי גוף משנים תפיסה, דחף ופעולה?'),
    whatItSupports: bi('A view in which perception and action depend on both incoming evidence and learned expectations.', 'מבט שלפיו תפיסה ופעולה תלויות גם במידע שנכנס וגם בציפיות שנלמדו.'),
    whatItDoesNotSupport: bi('The claim that every symptom is simply a mistaken prediction or can be thought away.', 'את הטענה שכל תסמין הוא רק חיזוי שגוי, או שאפשר להעלים אותו באמצעות מחשבה.'),
    whyItMatters: bi('It links bodily state, context and learning without reducing experience to one chemical.', 'התחום מחבר בין מצב הגוף, הקשר ולמידה בלי לצמצם את החוויה לחומר כימי אחד.'),
  },
  {
    id: 'research-nonlinear',
    kind: 'research',
    title: bi('Nonlinear dynamics and metastability', 'דינמיקה לא־ליניארית ומטא־יציבות'),
    subtitle: bi('Why small perturbations can matter differently in different states', 'למה שינוי קטן עשוי להשפיע אחרת במצבים שונים'),
    canonicalPath: '/research',
    readingMinutes: 8,
    question: bi('Why do some states resist change while others reorganize rapidly?', 'למה מצבים מסוימים מתנגדים לשינוי, ואחרים מתארגנים מחדש במהירות?'),
    whatItSupports: bi('State-dependent explanations involving feedback, timescale and interaction.', 'הסברים תלויי־מצב הכוללים משוב, טווחי זמן ואינטראקציה.'),
    whatItDoesNotSupport: bi('Treating mathematical metaphors as direct clinical measurements of one individual.', 'התייחסות למטאפורות מתמטיות כאילו הן מדידה קלינית ישירה של אדם מסוים.'),
    whyItMatters: bi('It helps explain why the same intervention is accessible on one day and nearly impossible on another.', 'התחום עוזר להבין למה אותה התערבות נגישה ביום אחד וכמעט בלתי אפשרית ביום אחר.'),
  },
  {
    id: 'research-neuromodulation',
    kind: 'research',
    title: bi('Neuromodulation and circuit-targeted treatment', 'נוירומודולציה וטיפול המכוון למעגלים'),
    subtitle: bi('From transmitters to stimulation, pathways and state dependence', 'ממוליכים עצביים ועד גירוי, מסלולים ותלות במצב'),
    canonicalPath: '/research',
    readingMinutes: 9,
    question: bi('How can changing circuit excitability alter a larger clinical trajectory?', 'כיצד שינוי בעוררות של מעגל יכול להשפיע על מסלול קליני רחב יותר?'),
    whatItSupports: bi('Specific, condition-dependent effects for some pharmacological and stimulation approaches.', 'השפעות מסוימות ותלויות־מצב של כמה גישות תרופתיות ושל גירוי מוחי.'),
    whatItDoesNotSupport: bi('A universal brain reset, guaranteed response or one protocol for every person.', '“אתחול מוח” אוניברסלי, תגובה מובטחת או פרוטוקול אחד שמתאים לכולם.'),
    whyItMatters: bi('It shows how targeted intervention and whole-person context can both be relevant.', 'התחום מראה כיצד גם התערבות ממוקדת וגם ההקשר של האדם השלם יכולים להיות רלוונטיים.'),
  },
];

export const exploreEntries: ExploreEntry[] = [
  {
    id: 'explore-lectures',
    kind: 'lecture',
    title: bi('Lectures', 'הרצאות'),
    subtitle: bi('Long-form pathways through recovery, mind, brain and dynamical systems', 'מסלולים ארוכים דרך החלמה, נפש, מוח ומערכות דינמיות'),
    eyebrow: bi('Read · 10–40 min', 'קריאה · 10–40 דקות'),
    canonicalPath: recoveryDynamics.canonicalPath,
    href: '/lectures',
  },
  {
    id: 'explore-atlas',
    kind: 'concept',
    title: bi('Recovery Brain Atlas', 'אטלס המוח של ההחלמה'),
    subtitle: bi('Recognizable anatomy, selected circuits and progressive explanation', 'אנטומיה ברורה, מעגלים נבחרים והסבר שנחשף בהדרגה'),
    eyebrow: bi('Interactive', 'אינטראקטיבי'),
    canonicalPath: '/atlas',
    href: '/atlas',
  },
  {
    id: 'explore-neuromodulation',
    kind: 'neuromodulation',
    title: bi('Neuromodulation', 'נוירומודולציה'),
    subtitle: bi('Dopamine, serotonin, noradrenaline, glutamate, GABA and pathways', 'דופמין, סרוטונין, נוראדרנלין, גלוטמט, GABA והמסלולים שלהם'),
    eyebrow: bi('Circuits · 12 min', 'מעגלים · 12 דקות'),
    canonicalPath: '/neuromodulation',
    href: '/neuromodulation',
  },
  {
    id: 'explore-therapy',
    kind: 'therapy',
    title: bi('Therapy Routes', 'מסלולי טיפול'),
    subtitle: bi('What different therapies change, when they fit and where their limits are', 'מה גישות טיפוליות שונות מנסות לשנות, מתי הן מתאימות והיכן הגבולות שלהן'),
    eyebrow: bi('Compare lenses', 'השוואת עדשות'),
    canonicalPath: '/psychotherapy',
    href: '/psychotherapy',
  },
  {
    id: 'explore-research',
    kind: 'research',
    title: bi('Research', 'מחקר'),
    subtitle: bi('What the evidence supports, what remains uncertain and why it matters', 'במה הראיות תומכות, מה עדיין אינו ברור ולמה זה חשוב'),
    eyebrow: bi('Evidence map', 'מפת ראיות'),
    canonicalPath: '/research',
    href: '/research',
  },
  {
    id: 'explore-framework',
    kind: 'concept',
    title: bi('Framework & journey', 'המסגרת והדרך האישית'),
    subtitle: bi('The scientific, humane and lived foundations of Flow Hijacked', 'היסודות המדעיים, האנושיים והאישיים של Flow Hijacked'),
    eyebrow: bi('About · 10 min', 'על הפרויקט · 10 דקות'),
    canonicalPath: frameworkJourney.canonicalPath,
    href: `/reading/${frameworkJourney.slug}`,
  },
];

export function destinationHref(destination: ContentDestination): string {
  if (destination.kind === 'here_and_now') return '/here-now';
  const reading = Object.values(readingDocuments).find((document) => document.id === destination.id);
  if (reading) return `/reading/${reading.slug}`;
  const therapy = Object.values(therapyDocuments).find((document) => document.id === destination.id);
  if (therapy) return `/therapy/${therapy.slug}`;
  if (destination.id === 'brain-atlas') return '/atlas';
  if (destination.kind === 'neuromodulation') return '/neuromodulation';
  if (destination.kind === 'research') return '/research';
  return '/(tabs)/explore';
}
