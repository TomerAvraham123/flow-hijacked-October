import type { Intervention, InterventionGoal } from '@/types/recovery';

// Canonical Flow Hijacked 42-practice library, adapted from the public Recovery OS content contract.
export const interventionGoals: InterventionGoal[] = [
  {
    "id": "steady-today",
    "label": {
      "en": "Steady today",
      "he": "לייצב את היום"
    }
  },
  {
    "id": "protect-recovery",
    "label": {
      "en": "Protect recovery",
      "he": "להגן על ההחלמה"
    }
  },
  {
    "id": "reduce-pressure",
    "label": {
      "en": "Reduce pressure",
      "he": "להפחית לחץ"
    }
  },
  {
    "id": "sleep-tonight",
    "label": {
      "en": "Sleep tonight",
      "he": "לישון הלילה"
    }
  },
  {
    "id": "restore-energy",
    "label": {
      "en": "Restore energy",
      "he": "להשיב אנרגיה"
    }
  },
  {
    "id": "reconnect",
    "label": {
      "en": "Reconnect",
      "he": "להתחבר מחדש"
    }
  },
  {
    "id": "rebuild-structure",
    "label": {
      "en": "Rebuild structure",
      "he": "לבנות מבנה מחדש"
    }
  },
  {
    "id": "meaningful-progress",
    "label": {
      "en": "Meaningful progress",
      "he": "התקדמות בעלת משמעות"
    }
  },
  {
    "id": "prepare-tomorrow",
    "label": {
      "en": "Prepare tomorrow",
      "he": "להכין את מחר"
    }
  }
];

export const interventionLibrary: Intervention[] = [
  {
    "id": "morning-light",
    "domain": "body",
    "role": "anchor",
    "family": "light",
    "title": {
      "en": "Morning outdoor light",
      "he": "אור בוקר בחוץ"
    },
    "instruction": {
      "en": "Step outside early in your waking day. Look at the surroundings, never directly at the sun, and account for heat and UV.",
      "he": "צאו החוצה בתחילת יום הערות. הביטו בסביבה, לעולם לא ישירות בשמש, והתחשבו בחום ובקרינה."
    },
    "why": {
      "en": "Light and timing can give the body a clearer daytime cue without asking for motivation first.",
      "he": "אור ותזמון יכולים לתת לגוף רמז יום ברור יותר בלי לדרוש תחילה מוטיבציה."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "steady-today",
      "sleep-tonight",
      "restore-energy",
      "prepare-tomorrow"
    ],
    "targets": [
      "body",
      "mind"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "food-water-anchor",
    "domain": "body",
    "role": "anchor",
    "family": "nourishment",
    "title": {
      "en": "Food + water anchor",
      "he": "עוגן של אוכל ומים"
    },
    "instruction": {
      "en": "If it fits your medical and dietary guidance, drink water and prepare one familiar meal or snack before a consequential decision.",
      "he": "אם הדבר מתאים להנחיות הרפואיות והתזונתיות שלכם, שתו מים והכינו ארוחה או נשנוש מוכרים לפני החלטה משמעותית."
    },
    "why": {
      "en": "A steadier physical floor can make other routes less expensive.",
      "he": "רצפה גופנית יציבה יותר יכולה להוזיל את המחיר של מסלולים אחרים."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "steady-today",
      "protect-recovery",
      "reduce-pressure",
      "restore-energy"
    ],
    "targets": [
      "body",
      "protection"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "easy-movement",
    "domain": "body",
    "role": "anchor",
    "family": "movement",
    "title": {
      "en": "Easy movement",
      "he": "תנועה קלה"
    },
    "instruction": {
      "en": "Walk, use a chair routine or move gently at a pace where conversation remains comfortable. Stop for pain, dizziness or feeling unwell.",
      "he": "לכו, השתמשו בתרגול כיסא או נועו בעדינות בקצב שמאפשר שיחה. עצרו בכאב, סחרחורת או הרגשה לא טובה."
    },
    "why": {
      "en": "Gentle movement changes body state and setting at the same time.",
      "he": "תנועה קלה משנה בעת ובעונה אחת את מצב הגוף ואת הסביבה."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "steady-today",
      "reduce-pressure",
      "restore-energy",
      "meaningful-progress"
    ],
    "targets": [
      "body",
      "mind",
      "reward"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "familiar-resistance",
    "domain": "body",
    "role": "build",
    "family": "strength",
    "title": {
      "en": "Familiar resistance session",
      "he": "אימון התנגדות מוכר"
    },
    "instruction": {
      "en": "Use only familiar movements and a manageable effort. Do not train through pain, dizziness, intoxication, injury or a medical exercise restriction.",
      "he": "השתמשו רק בתנועות מוכרות ובעומס סביר. אל תתאמנו דרך כאב, סחרחורת, שכרות, פציעה או מגבלה רפואית על פעילות."
    },
    "why": {
      "en": "A bounded strength practice can provide structure and evidence of capacity; maximal effort is not required.",
      "he": "תרגול כוח תחום יכול לספק מבנה וראיה ליכולת; אין צורך במאמץ מרבי."
    },
    "doses": [
      10,
      20,
      30
    ],
    "goals": [
      "restore-energy",
      "rebuild-structure",
      "meaningful-progress"
    ],
    "targets": [
      "body",
      "world",
      "reward"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "guided-deep-rest",
    "domain": "body",
    "role": "close",
    "family": "deep-rest",
    "title": {
      "en": "Guided deep rest · NSDR style",
      "he": "מנוחה עמוקה מודרכת · בסגנון NSDR"
    },
    "instruction": {
      "en": "Sit or lie somewhere safe with a familiar guided rest. Keep eyes open or switch to grounding if closing them increases distress. This does not replace sleep.",
      "he": "שבו או שכבו במקום בטוח עם הנחיית מנוחה מוכרת. השאירו עיניים פתוחות או עברו לעיגון אם עצימתן מגבירה מצוקה. הדבר אינו מחליף שינה."
    },
    "why": {
      "en": "Deliberate rest can lower the demand of the next interval without promising sleep or recovery.",
      "he": "מנוחה מכוונת יכולה להוריד את דרישת המרווח הבא בלי להבטיח שינה או החלמה."
    },
    "doses": [
      5,
      10,
      20
    ],
    "goals": [
      "reduce-pressure",
      "sleep-tonight",
      "restore-energy"
    ],
    "targets": [
      "body",
      "mind"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "sleep-landing",
    "domain": "body",
    "role": "close",
    "family": "sleep",
    "title": {
      "en": "Protect tonight’s landing",
      "he": "להגן על הנחיתה של הלילה"
    },
    "instruction": {
      "en": "Choose a realistic wake time, lower light and stimulation, prepare the room and place the phone away from the bed if feasible.",
      "he": "בחרו שעת יקיצה מציאותית, הפחיתו אור וגירוי, הכינו את החדר והרחיקו את הטלפון מן המיטה אם הדבר אפשרי."
    },
    "why": {
      "en": "A repeatable landing cue is more usable than demanding a perfect night.",
      "he": "רמז נחיתה שניתן לחזור עליו שימושי יותר מדרישה ללילה מושלם."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "sleep-tonight",
      "steady-today",
      "prepare-tomorrow",
      "protect-recovery"
    ],
    "targets": [
      "body",
      "mind",
      "world"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "warm-shower-reset",
    "domain": "body",
    "role": "close",
    "family": "sensory-reset",
    "title": {
      "en": "Warm-water reset",
      "he": "איפוס במים חמימים"
    },
    "instruction": {
      "en": "Use a familiar warm shower or wash your face and hands, then put on comfortable clothes. Keep the temperature safe.",
      "he": "השתמשו במקלחת חמימה ומוכרת או רחצו פנים וידיים, ואז לבשו בגדים נוחים. שמרו על טמפרטורה בטוחה."
    },
    "why": {
      "en": "A simple sensory transition can mark the end of one state and the beginning of another.",
      "he": "מעבר חושי פשוט יכול לסמן את סיומו של מצב אחד ואת תחילתו של אחר."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "reduce-pressure",
      "sleep-tonight",
      "steady-today"
    ],
    "targets": [
      "body",
      "mind"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "brief-meditation",
    "domain": "mind",
    "role": "anchor",
    "family": "meditation",
    "title": {
      "en": "Brief meditation drill",
      "he": "תרגיל מדיטציה קצר"
    },
    "instruction": {
      "en": "For a few minutes, notice breath, sound or contact with the chair and return gently when attention moves. Stop or switch to eyes-open grounding if distress rises.",
      "he": "לכמה דקות שימו לב לנשימה, לצליל או למגע עם הכיסא, וחזרו בעדינות כשהקשב נודד. עצרו או עברו לעיגון בעיניים פתוחות אם המצוקה עולה."
    },
    "why": {
      "en": "The drill practices returning attention; it is not a test of calmness.",
      "he": "התרגיל מאמן חזרה של הקשב; הוא אינו מבחן לרוגע."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "steady-today",
      "reduce-pressure",
      "meaningful-progress"
    ],
    "targets": [
      "mind"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "slow-exhale",
    "domain": "mind",
    "role": "anchor",
    "family": "breathing",
    "title": {
      "en": "Slow breathing · no holds",
      "he": "נשימה איטית · ללא עצירות"
    },
    "instruction": {
      "en": "Breathe comfortably and let the exhale become slightly longer than the inhale. Do not force, hold the breath or hyperventilate; stop if light-headed.",
      "he": "נשמו בנוחות והאריכו מעט את הנשיפה לעומת השאיפה. אל תכריחו, אל תעצרו נשימה ואל תבצעו אוורור־יתר; עצרו אם מתפתחת סחרחורת."
    },
    "why": {
      "en": "A short, gentle rhythm can offer the next minute a foothold.",
      "he": "קצב קצר ועדין יכול לתת לדקה הבאה נקודת אחיזה."
    },
    "doses": [
      1,
      3,
      5
    ],
    "goals": [
      "reduce-pressure",
      "steady-today",
      "sleep-tonight"
    ],
    "targets": [
      "mind",
      "body"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "five-senses",
    "domain": "mind",
    "role": "anchor",
    "family": "grounding",
    "title": {
      "en": "5–4–3–2–1 grounding",
      "he": "עיגון חושים 5–4–3–2–1"
    },
    "instruction": {
      "en": "Name five things you see, four sensations you feel, three sounds, two smells and one taste or neutral fact.",
      "he": "ציינו חמישה דברים שאתם רואים, ארבע תחושות גוף, שלושה צלילים, שני ריחות וטעם אחד או עובדה ניטרלית אחת."
    },
    "why": {
      "en": "Concrete sensory information can make the immediate setting more visible when attention has narrowed.",
      "he": "מידע חושי מוחשי יכול להפוך את הסביבה המיידית לגלויה יותר כשהקשב הצטמצם."
    },
    "doses": [
      3,
      5,
      8
    ],
    "goals": [
      "reduce-pressure",
      "protect-recovery",
      "steady-today"
    ],
    "targets": [
      "mind",
      "protection"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "urge-wave",
    "domain": "mind",
    "role": "anchor",
    "family": "urge-surfing",
    "title": {
      "en": "Ride one urge wave",
      "he": "לגלוש על גל אחד של דחף"
    },
    "instruction": {
      "en": "Only when you can stay safe: move away from access, notice where the urge is felt and describe how it changes while a timer runs. Add human support if the old route is close.",
      "he": "רק כשאפשר להישאר בטוחים: התרחקו מגישה, שימו לב היכן הדחף מורגש ותארו כיצד הוא משתנה בזמן שטיימר פועל. הוסיפו תמיכה אנושית אם המסלול הישן קרוב."
    },
    "why": {
      "en": "The aim is not to erase the urge; it is to keep a safer branch open for one interval.",
      "he": "המטרה אינה למחוק את הדחף; היא להשאיר ענף בטוח יותר פתוח למרווח אחד."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "protect-recovery",
      "reduce-pressure"
    ],
    "targets": [
      "protection",
      "mind"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "mind-unload",
    "domain": "mind",
    "role": "build",
    "family": "cognitive-offload",
    "title": {
      "en": "Three-line mind unload",
      "he": "פריקת עומס בשלוש שורות"
    },
    "instruction": {
      "en": "Write only: what must happen, what can wait and the next safe decision. Stop when the three lines exist.",
      "he": "כתבו רק: מה חייב לקרות, מה יכול לחכות ומה ההחלטה הבטוחה הבאה. עצרו כששלוש השורות קיימות."
    },
    "why": {
      "en": "Externalizing the load can make the next decision smaller without solving the whole day.",
      "he": "הוצאת העומס החוצה יכולה להקטין את ההחלטה הבאה בלי לפתור את היום כולו."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "reduce-pressure",
      "rebuild-structure",
      "prepare-tomorrow"
    ],
    "targets": [
      "mind",
      "world",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "compassionate-naming",
    "domain": "mind",
    "role": "future",
    "family": "self-compassion",
    "title": {
      "en": "Compassionate naming",
      "he": "מתן שם בחמלה"
    },
    "instruction": {
      "en": "Complete three lines: ‘What is here… What makes sense about it… What I need next…’ Avoid forced positivity.",
      "he": "השלימו שלוש שורות: ״מה נמצא כאן… מה מובן בזה… מה אני צריך/ה עכשיו…״ בלי חיוביות כפויה."
    },
    "why": {
      "en": "Accurate naming can reduce the extra load created by fighting the fact of the moment.",
      "he": "מתן שם מדויק יכול להפחית את העומס הנוסף שנוצר מן המאבק בעובדת הרגע."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "reduce-pressure",
      "steady-today",
      "meaningful-progress"
    ],
    "targets": [
      "mind",
      "future"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "decision-freeze",
    "domain": "mind",
    "role": "close",
    "family": "decision-boundary",
    "title": {
      "en": "Pause one consequential decision",
      "he": "להשהות החלטה משמעותית אחת"
    },
    "instruction": {
      "en": "Write which decision can safely wait, when you will revisit it and who—if anyone—should be included.",
      "he": "כתבו איזו החלטה יכולה לחכות בבטחה, מתי תחזרו אליה ומי, אם בכלל, צריך להיות שותף."
    },
    "why": {
      "en": "Reducing immediate cognitive load can preserve options until the field is less compressed.",
      "he": "הפחתת העומס הקוגניטיבי המיידי יכולה לשמור אפשרויות עד שהשדה יהיה פחות דחוס."
    },
    "doses": [
      1,
      3,
      5
    ],
    "goals": [
      "reduce-pressure",
      "protect-recovery",
      "prepare-tomorrow"
    ],
    "targets": [
      "mind",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "one-line-check-in",
    "domain": "relationships",
    "role": "bridge",
    "family": "message",
    "title": {
      "en": "One-line check-in",
      "he": "הודעת קשר בשורה אחת"
    },
    "instruction": {
      "en": "Send: ‘You do not need to fix this. Can we stay connected for a few minutes?’ Choose someone who is safe for you.",
      "he": "שלחו: ״אין צורך לפתור את זה. אפשר להישאר איתי בקשר לכמה דקות?״ בחרו אדם שבטוח עבורכם."
    },
    "why": {
      "en": "A low-threshold message shortens the distance to co-regulation and honesty.",
      "he": "הודעה בעלת סף נמוך מקצרת את המרחק לוויסות משותף ולכנות."
    },
    "doses": [
      1,
      3,
      5
    ],
    "goals": [
      "reconnect",
      "protect-recovery",
      "reduce-pressure",
      "steady-today"
    ],
    "targets": [
      "relationships",
      "protection"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "bounded-call",
    "domain": "relationships",
    "role": "bridge",
    "family": "call",
    "title": {
      "en": "Bounded human call",
      "he": "שיחה אנושית תחומה"
    },
    "instruction": {
      "en": "Ask one safe person for a time-bounded call and say whether you need listening, company or practical help—not fixing.",
      "he": "בקשו מאדם בטוח שיחה תחומה בזמן ואמרו אם דרושים הקשבה, חברה או עזרה מעשית — לא תיקון."
    },
    "why": {
      "en": "A clear time and request can make contact easier to begin.",
      "he": "זמן ובקשה ברורים יכולים להקל על תחילת הקשר."
    },
    "doses": [
      5,
      10,
      15
    ],
    "goals": [
      "reconnect",
      "protect-recovery",
      "reduce-pressure"
    ],
    "targets": [
      "relationships",
      "mind",
      "protection"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "shared-ordinary",
    "domain": "relationships",
    "role": "bridge",
    "family": "shared-activity",
    "title": {
      "en": "Share one ordinary activity",
      "he": "לחלוק פעילות יומיומית אחת"
    },
    "instruction": {
      "en": "Share a walk, meal, coffee, errand or household task with a safe person. A deep conversation is not required.",
      "he": "חלקו הליכה, ארוחה, קפה, סידור או מטלת בית עם אדם בטוח. אין צורך בשיחה עמוקה."
    },
    "why": {
      "en": "Proximity can begin before connection feels easy.",
      "he": "קרבה יכולה להתחיל עוד לפני שקשר מרגיש קל."
    },
    "doses": [
      10,
      20,
      30
    ],
    "goals": [
      "reconnect",
      "restore-energy",
      "steady-today"
    ],
    "targets": [
      "relationships",
      "world",
      "reward"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "specific-ask",
    "domain": "relationships",
    "role": "bridge",
    "family": "request",
    "title": {
      "en": "Make one specific ask",
      "he": "לבקש בקשה מדויקת אחת"
    },
    "instruction": {
      "en": "Ask for one observable form of support with a time boundary and permission for the other person to decline.",
      "he": "בקשו צורת תמיכה אחת שאפשר לראות, עם גבול זמן ורשות לאדם האחר לסרב."
    },
    "why": {
      "en": "Specific requests reduce mind-reading and make consent clearer on both sides.",
      "he": "בקשות מדויקות מפחיתות קריאת מחשבות ומבהירות הסכמה לשני הצדדים."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "reconnect",
      "protect-recovery",
      "rebuild-structure"
    ],
    "targets": [
      "relationships",
      "world"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "boundary-draft",
    "domain": "relationships",
    "role": "build",
    "family": "boundary",
    "title": {
      "en": "Draft one boundary",
      "he": "לנסח גבול אחד"
    },
    "instruction": {
      "en": "Draft—but do not have to send—what happened, what you need and what you will do if the boundary is crossed. Use support if the relationship is unsafe.",
      "he": "נסחו — בלי חובה לשלוח — מה קרה, מה נדרש ומה תעשו אם הגבול ייחצה. השתמשו בתמיכה אם הקשר אינו בטוח."
    },
    "why": {
      "en": "A usable boundary turns a diffuse relational load into a clearer next action.",
      "he": "גבול שימושי הופך עומס יחסי מפוזר לפעולה הבאה ברורה יותר."
    },
    "doses": [
      5,
      10,
      20
    ],
    "goals": [
      "reconnect",
      "reduce-pressure",
      "meaningful-progress"
    ],
    "targets": [
      "relationships",
      "mind",
      "future"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "small-repair",
    "domain": "relationships",
    "role": "future",
    "family": "repair",
    "title": {
      "en": "Small repair or appreciation",
      "he": "תיקון קטן או הבעת הערכה"
    },
    "instruction": {
      "en": "Acknowledge one impact, responsibility or genuine appreciation without demanding reassurance or immediate closure.",
      "he": "הכירו בהשפעה אחת, באחריות אחת או בהערכה כנה בלי לדרוש הרגעה או סגירת מעגל מיידית."
    },
    "why": {
      "en": "A bounded repair can leave evidence that a relationship has more than one possible next state.",
      "he": "תיקון תחום יכול להשאיר ראיה לכך שלקשר יש יותר ממצב עתידי אפשרי אחד."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "reconnect",
      "meaningful-progress",
      "prepare-tomorrow"
    ],
    "targets": [
      "relationships",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "shared-meal",
    "domain": "relationships",
    "role": "close",
    "family": "shared-meal",
    "title": {
      "en": "Make one meal less isolated",
      "he": "להפוך ארוחה אחת לפחות מבודדת"
    },
    "instruction": {
      "en": "If it is safe and workable, eat with someone, call during meal preparation or sit in a shared place. Follow your dietary care plan.",
      "he": "אם הדבר בטוח וישים, אכלו עם אדם נוסף, התקשרו בזמן הכנת האוכל או שבו במקום משותף. פעלו לפי תוכנית התזונה שלכם."
    },
    "why": {
      "en": "One ordinary shared transition can support body and connection together.",
      "he": "מעבר יומיומי משותף אחד יכול לתמוך בגוף ובקשר יחד."
    },
    "doses": [
      5,
      15,
      30
    ],
    "goals": [
      "reconnect",
      "steady-today",
      "restore-energy"
    ],
    "targets": [
      "relationships",
      "body"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "mutual-aid-window",
    "domain": "recovery-support",
    "role": "bridge",
    "family": "mutual-aid",
    "title": {
      "en": "AA, NA, SMART—or another fit",
      "he": "AA, NA, SMART — או מסגרת מתאימה אחרת"
    },
    "instruction": {
      "en": "Find or attend an existing in-person or online mutual-aid meeting that fits your pathway. If time is short, identify the next meeting and save the link or place.",
      "he": "מצאו או השתתפו במפגש תמיכה הדדית קיים, מקוון או פנים אל פנים, שמתאים לדרך שלכם. אם הזמן קצר, מצאו את המפגש הבא ושמרו קישור או מקום."
    },
    "why": {
      "en": "Mutual aid can make experience, accountability and belonging more reachable; no single fellowship fits everyone.",
      "he": "תמיכה הדדית יכולה להפוך ניסיון, אחריות ושייכות לנגישים יותר; אין מסגרת אחת שמתאימה לכולם."
    },
    "doses": [
      3,
      30,
      60
    ],
    "goals": [
      "protect-recovery",
      "reconnect",
      "steady-today"
    ],
    "targets": [
      "protection",
      "relationships",
      "care"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "peer-contact",
    "domain": "recovery-support",
    "role": "bridge",
    "family": "peer",
    "title": {
      "en": "Sponsor, mentor or peer contact",
      "he": "קשר עם ספונסר, חונך או עמית"
    },
    "instruction": {
      "en": "Make a brief contact and say plainly what changed, what is accessible and what kind of support you need for the next interval.",
      "he": "צרו קשר קצר ואמרו בפשטות מה השתנה, למה יש גישה ואיזו תמיכה נדרשת במרווח הבא."
    },
    "why": {
      "en": "Reachable recovery support can interrupt the coupling between pressure, access and isolation.",
      "he": "תמיכת החלמה נגישה יכולה לקטוע את הצימוד בין לחץ, גישה ובידוד."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "protect-recovery",
      "reconnect",
      "reduce-pressure"
    ],
    "targets": [
      "protection",
      "relationships",
      "care"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "therapy-continuity",
    "domain": "recovery-support",
    "role": "bridge",
    "family": "therapy",
    "title": {
      "en": "Keep therapy reachable",
      "he": "להשאיר את הטיפול נגיש"
    },
    "instruction": {
      "en": "Attend the existing appointment, confirm it or send one scheduling message. This planner does not create trauma exposure or replace professional care.",
      "he": "השתתפו בפגישה הקיימת, אשרו אותה או שלחו הודעת תיאום אחת. המתכנן אינו יוצר חשיפה לטראומה ואינו מחליף טיפול מקצועי."
    },
    "why": {
      "en": "Continuity helps before motivation has to carry the whole system.",
      "he": "רצף עוזר עוד לפני שהמוטיבציה נדרשת לשאת את המערכת כולה."
    },
    "doses": [
      3,
      10,
      50
    ],
    "goals": [
      "protect-recovery",
      "reconnect",
      "meaningful-progress"
    ],
    "targets": [
      "care",
      "relationships"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "therapy-prep",
    "domain": "recovery-support",
    "role": "build",
    "family": "therapy-prep",
    "title": {
      "en": "Prepare the next therapy contact",
      "he": "להכין את הקשר הטיפולי הבא"
    },
    "instruction": {
      "en": "Write one change, one concern, one question and anything that needs same-day attention. Bring the note to existing care.",
      "he": "כתבו שינוי אחד, דאגה אחת, שאלה אחת וכל דבר שדורש תשומת לב עוד היום. הביאו את הרשימה לטיפול הקיים."
    },
    "why": {
      "en": "A small amount of preparation can make a support contact more usable.",
      "he": "מעט הכנה יכולה להפוך קשר תמיכה לשימושי יותר."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "protect-recovery",
      "rebuild-structure",
      "meaningful-progress"
    ],
    "targets": [
      "care",
      "mind",
      "future"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "rapid-protection-map",
    "domain": "recovery-support",
    "role": "bridge",
    "family": "protection-map",
    "title": {
      "en": "Rapid recovery-protection map",
      "he": "מפת הגנה מהירה להחלמה"
    },
    "instruction": {
      "en": "Review access, cues, the next exposed transition, tonight, one safe person and the next professional or peer contact. Never handle unsafe items alone.",
      "he": "עברו על גישה, רמזים, המעבר החשוף הבא, הלילה, אדם בטוח אחד והקשר המקצועי או העמיתי הבא. לעולם אל תטפלו בחפצים מסוכנים לבד."
    },
    "why": {
      "en": "A protection map moves safety from intention into people, places and barriers.",
      "he": "מפת הגנה מעבירה בטיחות מכוונה אל אנשים, מקומות ומחסומים."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "protect-recovery",
      "prepare-tomorrow",
      "reduce-pressure"
    ],
    "targets": [
      "protection",
      "relationships",
      "world",
      "care"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "care-plan-reconnect",
    "domain": "recovery-support",
    "role": "close",
    "family": "care-plan",
    "title": {
      "en": "Reconnect the existing care plan",
      "he": "לחבר מחדש את תוכנית הטיפול הקיימת"
    },
    "instruction": {
      "en": "Open the plan made with your clinician, follow it as already agreed or prepare questions. Do not change medication or detox plans here.",
      "he": "פתחו את התוכנית שנבנתה עם המטפל, פעלו לפיה כפי שסוכם או הכינו שאלות. אל תשנו כאן תרופות או תוכניות גמילה."
    },
    "why": {
      "en": "An existing plan can hold decisions that should not be improvised under pressure.",
      "he": "תוכנית קיימת יכולה להחזיק החלטות שלא נכון לאלתר תחת לחץ."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "protect-recovery",
      "prepare-tomorrow",
      "steady-today"
    ],
    "targets": [
      "care",
      "protection"
    ],
    "evidenceTier": "A"
  },
  {
    "id": "recovery-reading",
    "domain": "recovery-support",
    "role": "future",
    "family": "recovery-learning",
    "title": {
      "en": "Ten minutes of recovery learning",
      "he": "עשר דקות של למידת החלמה"
    },
    "instruction": {
      "en": "Choose one saved lecture, workbook page, meeting reading or clinician-recommended resource. Write one line you want to test in real life.",
      "he": "בחרו הרצאה שמורה, עמוד בחוברת, קריאת מפגש או משאב שהומלץ בידי מטפל. כתבו שורה אחת שתרצו לבדוק בחיים."
    },
    "why": {
      "en": "Learning becomes more usable when it ends in one observable experiment.",
      "he": "למידה נעשית שימושית יותר כשהיא מסתיימת בניסוי אחד שאפשר לראות."
    },
    "doses": [
      5,
      10,
      20
    ],
    "goals": [
      "meaningful-progress",
      "protect-recovery",
      "prepare-tomorrow"
    ],
    "targets": [
      "care",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "minimum-viable-day",
    "domain": "structure",
    "role": "build",
    "family": "minimum-day",
    "title": {
      "en": "Minimum viable day",
      "he": "יום מינימלי בר־קיימא"
    },
    "instruction": {
      "en": "Place only four anchors: food, one necessary task, one human contact and a protected evening transition. Smaller is allowed.",
      "he": "מקמו רק ארבעה עוגנים: אוכל, משימה הכרחית אחת, קשר אנושי אחד ומעבר ערב מוגן. מותר להקטין."
    },
    "why": {
      "en": "A minimal scaffold can keep the day from depending on continuous motivation.",
      "he": "שלד מינימלי יכול למנוע מן היום להיות תלוי במוטיבציה רצופה."
    },
    "doses": [
      5,
      10,
      20
    ],
    "goals": [
      "steady-today",
      "rebuild-structure",
      "protect-recovery"
    ],
    "targets": [
      "world",
      "body",
      "relationships"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "protect-transition",
    "domain": "structure",
    "role": "build",
    "family": "transition",
    "title": {
      "en": "Protect the next transition",
      "he": "להגן על המעבר הבא"
    },
    "instruction": {
      "en": "Name the next exposed time or place and add one route, person, meal, location or fallback before it arrives.",
      "he": "תנו שם לזמן או למקום החשוף הבא והוסיפו מסלול, אדם, ארוחה, מקום או חלופה אחת לפני שהוא מגיע."
    },
    "why": {
      "en": "Risk and effort often concentrate between activities, places and people.",
      "he": "סיכון ומאמץ מצטברים לעיתים בין פעילויות, מקומות ואנשים."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "protect-recovery",
      "prepare-tomorrow",
      "steady-today"
    ],
    "targets": [
      "world",
      "protection",
      "relationships"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "boundary-condition",
    "domain": "structure",
    "role": "build",
    "family": "environment",
    "title": {
      "en": "Change one boundary condition",
      "he": "לשנות תנאי סביבה אחד"
    },
    "instruction": {
      "en": "Put one support within reach or one ordinary cue out of sight. Do not handle substances, weapons or other unsafe objects alone.",
      "he": "קרבו תמיכה אחת או הרחיקו רמז יומיומי אחד מטווח הראייה. אל תטפלו לבד בחומרים, כלי נשק או חפצים מסוכנים אחרים."
    },
    "why": {
      "en": "The environment can change the effort required by the next route.",
      "he": "הסביבה יכולה לשנות את המאמץ שהמסלול הבא דורש."
    },
    "doses": [
      1,
      3,
      5
    ],
    "goals": [
      "protect-recovery",
      "reduce-pressure",
      "rebuild-structure"
    ],
    "targets": [
      "world",
      "protection"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "zone-reset",
    "domain": "structure",
    "role": "build",
    "family": "zone-reset",
    "title": {
      "en": "Ten-minute zone reset",
      "he": "איפוס אזור בעשר דקות"
    },
    "instruction": {
      "en": "Reset only the physical area required for the next action, then stop when the timer ends.",
      "he": "סדרו רק את האזור הפיזי שנדרש לפעולה הבאה, ואז עצרו כשהטיימר מסתיים."
    },
    "why": {
      "en": "A bounded environmental reset can lower friction without turning into an all-day project.",
      "he": "איפוס סביבתי תחום יכול להפחית חיכוך בלי להפוך לפרויקט של יום שלם."
    },
    "doses": [
      3,
      10,
      15
    ],
    "goals": [
      "rebuild-structure",
      "reduce-pressure",
      "prepare-tomorrow"
    ],
    "targets": [
      "world",
      "mind"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "task-opening",
    "domain": "structure",
    "role": "build",
    "family": "task-opening",
    "title": {
      "en": "Open one task—do not finish it",
      "he": "לפתוח משימה אחת — לא לסיים אותה"
    },
    "instruction": {
      "en": "Open the file, lay out the tools or complete the first bounded work interval. Finishing the whole task is optional.",
      "he": "פתחו את הקובץ, פרסו את הכלים או השלימו את מקטע העבודה התחום הראשון. סיום המשימה כולה הוא אופציונלי."
    },
    "why": {
      "en": "Starting can create evidence of agency while keeping the demand finite.",
      "he": "התחלה יכולה ליצור ראיה ליכולת פעולה תוך שמירה על דרישה סופית."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "rebuild-structure",
      "meaningful-progress",
      "prepare-tomorrow"
    ],
    "targets": [
      "world",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "tomorrow-first-move",
    "domain": "structure",
    "role": "close",
    "family": "tomorrow-prep",
    "title": {
      "en": "Prepare tomorrow’s first move",
      "he": "להכין את המהלך הראשון של מחר"
    },
    "instruction": {
      "en": "Place the first item, time, route or message where it will meet you at the start of tomorrow.",
      "he": "מקמו את הפריט, השעה, המסלול או ההודעה הראשונים במקום שבו יפגשו אתכם בתחילת מחר."
    },
    "why": {
      "en": "A prepared first move shortens the distance between intention and action.",
      "he": "מהלך ראשון מוכן מקצר את המרחק בין כוונה לפעולה."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "prepare-tomorrow",
      "sleep-tonight",
      "rebuild-structure"
    ],
    "targets": [
      "world",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "digital-sunset",
    "domain": "structure",
    "role": "close",
    "family": "digital-boundary",
    "title": {
      "en": "Create one digital sunset",
      "he": "ליצור שקיעה דיגיטלית אחת"
    },
    "instruction": {
      "en": "Choose one realistic time to silence nonessential alerts and place the most absorbing device away from the sleep space.",
      "he": "בחרו שעה מציאותית להשתקת התראות לא הכרחיות והרחיקו את המכשיר השואב ביותר מאזור השינה."
    },
    "why": {
      "en": "A visible digital boundary can reduce stimulation and protect the next transition.",
      "he": "גבול דיגיטלי גלוי יכול להפחית גירוי ולהגן על המעבר הבא."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "sleep-tonight",
      "reduce-pressure",
      "prepare-tomorrow"
    ],
    "targets": [
      "world",
      "mind",
      "body"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "value-in-action",
    "domain": "meaning",
    "role": "future",
    "family": "values",
    "title": {
      "en": "One value in action",
      "he": "ערך אחד בפעולה"
    },
    "instruction": {
      "en": "Name one value and perform the smallest action that would leave visible evidence of it today.",
      "he": "תנו שם לערך אחד ובצעו את המעשה הקטן ביותר שישאיר ממנו ראיה גלויה היום."
    },
    "why": {
      "en": "Meaning becomes usable when it is translated into an observable act.",
      "he": "משמעות נעשית שימושית כשהיא מתורגמת למעשה שאפשר לראות."
    },
    "doses": [
      3,
      5,
      15
    ],
    "goals": [
      "meaningful-progress",
      "steady-today",
      "prepare-tomorrow"
    ],
    "targets": [
      "future",
      "reward"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "bridge-tomorrow",
    "domain": "meaning",
    "role": "future",
    "family": "future-bridge",
    "title": {
      "en": "Build a bridge to tomorrow",
      "he": "לבנות גשר למחר"
    },
    "instruction": {
      "en": "Write one thing worth carrying through the next 24 hours and the first step—under three minutes—toward it.",
      "he": "כתבו דבר אחד שראוי לשאת דרך 24 השעות הבאות ואת הצעד הראשון — פחות משלוש דקות — לקראתו."
    },
    "why": {
      "en": "The future competes more effectively when it has a credible first step.",
      "he": "העתיד מתחרה ביעילות רבה יותר כשיש לו צעד ראשון אמין."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "prepare-tomorrow",
      "meaningful-progress",
      "protect-recovery"
    ],
    "targets": [
      "future",
      "world"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "creative-contact",
    "domain": "meaning",
    "role": "future",
    "family": "creativity",
    "title": {
      "en": "Creative contact—not a performance",
      "he": "מגע יצירתי — לא הופעה"
    },
    "instruction": {
      "en": "Write, draw, play music, photograph, cook, build or repair without judging quality. Stop at the chosen boundary.",
      "he": "כתבו, ציירו, נגנו, צלמו, בשלו, בנו או תקנו בלי לשפוט איכות. עצרו בגבול שנבחר."
    },
    "why": {
      "en": "Ordinary reward can return through contact and participation before strong enjoyment arrives.",
      "he": "תגמול יומיומי יכול לחזור דרך מגע והשתתפות לפני שמגיעה הנאה חזקה."
    },
    "doses": [
      5,
      10,
      30
    ],
    "goals": [
      "restore-energy",
      "meaningful-progress",
      "reduce-pressure"
    ],
    "targets": [
      "reward",
      "future"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "nature-place-contact",
    "domain": "meaning",
    "role": "anchor",
    "family": "nature",
    "title": {
      "en": "Contact with nature or place",
      "he": "מגע עם טבע או מקום"
    },
    "instruction": {
      "en": "Spend a bounded interval attending to an outdoor or meaningful place. Mood improvement is not required.",
      "he": "בלו מרווח תחום בהפניית קשב למקום בחוץ או למקום בעל משמעות. אין צורך בשיפור מצב הרוח."
    },
    "why": {
      "en": "A change of place can widen sensory and future cues without requiring a big project.",
      "he": "שינוי מקום יכול להרחיב רמזים חושיים ועתידיים בלי לדרוש פרויקט גדול."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "restore-energy",
      "reduce-pressure",
      "meaningful-progress"
    ],
    "targets": [
      "reward",
      "body",
      "future"
    ],
    "evidenceTier": "B"
  },
  {
    "id": "bounded-contribution",
    "domain": "meaning",
    "role": "build",
    "family": "contribution",
    "title": {
      "en": "Bounded contribution",
      "he": "תרומה תחומה"
    },
    "instruction": {
      "en": "Help one person, household, community or project in a way that can finish today. Keep the boundary explicit.",
      "he": "עזרו לאדם, לבית, לקהילה או לפרויקט בדרך שאפשר לסיים היום. שמרו על גבול מפורש."
    },
    "why": {
      "en": "Contribution can leave visible evidence of agency and belonging.",
      "he": "תרומה יכולה להשאיר ראיה גלויה ליכולת פעולה ולשייכות."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "meaningful-progress",
      "reconnect",
      "rebuild-structure"
    ],
    "targets": [
      "future",
      "relationships",
      "reward"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "evidence-from-day",
    "domain": "meaning",
    "role": "close",
    "family": "reflection",
    "title": {
      "en": "Three lines of evidence",
      "he": "שלוש שורות של ראיות"
    },
    "instruction": {
      "en": "Write: what I protected, what I learned and what I want to carry forward. Do not force gratitude or positivity.",
      "he": "כתבו: על מה הגנתי, מה למדתי ומה ארצה לשאת קדימה. אל תכפו הכרת תודה או חיוביות."
    },
    "why": {
      "en": "A brief record can connect this day to a future self without turning it into a verdict.",
      "he": "רישום קצר יכול לחבר את היום לעצמי עתידי בלי להפוך אותו לפסק דין."
    },
    "doses": [
      3,
      5,
      10
    ],
    "goals": [
      "meaningful-progress",
      "prepare-tomorrow",
      "steady-today"
    ],
    "targets": [
      "future",
      "mind"
    ],
    "evidenceTier": "C"
  },
  {
    "id": "ordinary-reward",
    "domain": "meaning",
    "role": "close",
    "family": "ordinary-reward",
    "title": {
      "en": "One ordinary reward",
      "he": "תגמול יומיומי אחד"
    },
    "instruction": {
      "en": "Choose one low-cost contact with life—music, warm water, a familiar place, a pet, craft or safe company—and stay without testing whether it feels good enough.",
      "he": "בחרו מגע אחד בעל עלות נמוכה עם החיים — מוזיקה, מים חמימים, מקום מוכר, בעל חיים, יצירה או חברה בטוחה — והישארו בלי לבדוק אם זה מרגיש טוב מספיק."
    },
    "why": {
      "en": "Recovery needs repeated access to ordinary reward, not only distance from the old route.",
      "he": "החלמה זקוקה לגישה חוזרת לתגמול יומיומי, לא רק למרחק מן המסלול הישן."
    },
    "doses": [
      3,
      10,
      20
    ],
    "goals": [
      "restore-energy",
      "reduce-pressure",
      "steady-today"
    ],
    "targets": [
      "reward",
      "future"
    ],
    "evidenceTier": "B"
  }
];
