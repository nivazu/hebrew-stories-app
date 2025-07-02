# מחולל סיפורי ילדים בעברית 🎭📚

אפליקציה מתקדמת ליצירת סיפורי ילדים מותאמים אישית בעברית באמצעות AI.

## מה האפליקציה כוללת? ✨

- **יצירת סיפורים מותאמים אישית** - לפי גיל, מגדר, תחומי עניין
- **סגנונות מגוונים** - מצחיק, הרפתקה, חינוכי, קסום
- **דמויות מוכרות** - אפשרות לבחור מסדרות כמו פיפ ופוזי, דוב קטן
- **לקחים חינוכיים** - שיתוף, כנות, אומץ, חברות
- **הדפסה מיידית** - אופטימיזציה מלאה להדפסת A4
- **עיצוב מותאם לילדים** - צבעוני, נעים ופשוט לשימוש

## העלאה צעד אחר צעד 🚀

### צעד 1: יצירת API Key ב-OpenAI
1. היכנס ל-[platform.openai.com](https://platform.openai.com)
2. לך ל-"API Keys"
3. לחץ "Create new secret key"
4. העתק את המפתח ושמור אותו!

### צעד 2: הכנת הקבצים
צור תיקייה חדשה במחשב ושמור בה:

**קבצים חובה:**
- `package.json`
- `pages/index.js`
- `pages/api/generate-story.js`
- `.env.local` (עם המפתח שלך!)

### צעד 3: יצירת GitHub Repository
1. היכנס ל-[github.com](https://github.com)
2. לחץ "New repository"
3. קרא לו `hebrew-stories-app`
4. בחר "Public"
5. לחץ "Create repository"

### צעד 4: העלאה ל-GitHub
1. גרור את כל הקבצים לGitHub (או השתמש ב-Git)
2. **חשוב: אל תעלה את קובץ .env.local!**

### צעד 5: חיבור ל-Vercel
1. היכנס ל-[vercel.com](https://vercel.com)
2. לחץ "New Project"
3. בחר את הrepo שיצרת
4. לחץ "Import"

### צעד 6: הגדרת Environment Variables
ב-Vercel:
1. לך ל-"Settings" → "Environment Variables"
2. הוסף משתנה חדש:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** המפתח שלך מOpenAI
3. לחץ "Add"

### צעד 7: Deploy!
1. לחץ "Deploy"
2. המתן כמה דקות
3. קבל קישור לאתר שלך! 🎉

## מבנה הקבצים 📁

```
hebrew-stories-app/
├── package.json          # תלויות הפרויקט
├── pages/
│   ├── index.js          # האפליקציה הראשית
│   └── api/
│       └── generate-story.js  # API ליצירת סיפורים
├── .env.local            # משתני סביבה (אל תעלה לGitHub!)
└── README.md            # המדריך הזה
```

## עלויות 💰

- **Vercel:** חינם לחלוטין! 🆓
- **OpenAI:** ~0.001₪ לסיפור (אגורה!)
- **100 סיפורים = ~0.10₪** (עשר אגורות)

## תמיכה טכנית 🔧

**שגיאות נפוצות:**
- **"API key not found"** → ודא שהוספת את OPENAI_API_KEY ב-Vercel
- **"Quota exceeded"** → הוסף אשראי בחשבון OpenAI
- **"Internal server error"** → בדוק את הlogs ב-Vercel

**איפה לבדוק logs:**
Vercel → פרויקט שלך → Functions → בחר function → View Logs

## אבטחה וגיבוי 🔒

- ה-API key מוגן בשרת ולא חשוף למשתמשים
- כל הקוד open-source ובטוח לשימוש
- אין שמירת מידע אישי

## עדכונים עתידיים 🔮

- תמיכה בציורים AI
- יותר סדרות דמויות
- אפשרות שמירת סיפורים
- גרסה למובייל

---

**נוצר עם ❤️ לילדים דוברי עברית**

לשאלות או בעיות: צור issue בGitHub או צור קשר.

**בהצלחה עם הסיפורים! 🎭✨**
