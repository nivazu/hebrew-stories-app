import OpenAI from 'openai';

// יצירת חיבור ל-OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // רק POST requests מותרים
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { age, gender, interests, style, series, lesson } = req.body;

    // בדיקת שדות חובה
    if (!age || !style) {
      return res.status(400).json({ error: 'Age and style are required' });
    }

    // בניית הפרומפט המתקדם לOpenAI
    const prompt = `צור סיפור ילדים מרהיב בעברית עם הפרטים הבאים:

גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה'}
תחומי עניין וחוביות: ${interests || 'כללי'}
סגנון הסיפור: ${style}
סדרת סיפורים מבוקשת: ${series || 'סיפור מקורי וחדש'}
לקח חינוכי: ${lesson || 'כללי'}

דרישות הסיפור המתקדמות:
- כתוב בעברית תקנית עם ניקוד חלקי במילים מורכבות לשיפור הקריאות
- מתאים בדיוק לגיל שנבחר (${age}) - רמת השפה, האורך והמורכבות
- אורך של 250-500 מילים (בהתאם לגיל: צעירים יותר = קצר יותר)
- כולל דמויות חיות, מעניינות וייחודיות שקשורות לתחומי העניין
- מסר חינוכי טבעי שזורג באופן אורגני בעלילה ללא דידקטיות
- סיום מרגש, מעורר השראה וחיובי שמשאיר רושם
- דיאלוגים קצרים, טבעיים וחיים המתאימים לגיל
- שפה עשירה, יפה ומדויקת עם מילים מעוררות דמיון
- אווירה חמה, אוהבת ובטוחה המתאימה לקריאה לפני השינה
- מבנה ברור עם התחלה מעניינת, התפתחות והסתיימות מספקת

${series ? `
הוראות מיוחדות לסדרת סיפורים:
- השתמש בדמויות, בעולם ובסגנון של סדרת "${series}"
- שמור על הרוח והאופי המקורי של הסדרה
- התאם את הסיפור לסגנון הסדרה הזו
- כלול אלמנטים מוכרים מהסדרה כדי שהילדים יזהו ויתחברו
` : `
הוראות לסיפור מקורי:
- צור דמויות מקוריות וייחודיות המותאמות לתחומי העניין
- פתח עולם חדש ומרתק המתאים לסגנון שנבחר
- הוסף פרטים יצירתיים ומפתיעים שיעשירו את הסיפור
`}

חשוב מאוד: אנא החזר את התשובה בפורמט JSON הבא בלבד:
{
  "title": "כותרת הסיפור בעברית - יצירתית, מושכת ומתאימה לגיל",
  "story": "תוכן הסיפור המלא בעברית מחולק לפסקאות עם מעברי שורה"
}

תוודא שהסיפור מרתק, מעניין, מתאים בדיוק לגיל שנבחר, ומעביר את הלקח החינוכי באופן טבעי, מהנה וזוכר.`;

    // שליחה ל-OpenAI עם הגדרות מותאמות
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // המודל הכי טוב ליצירת תוכן בעברית
      messages: [
        {
          role: "system",
          content: `אתה כותב סיפורי ילדים מקצועי ומומחה ביצירה בעברית. 
          אתה מתמחה ביצירת סיפורים מעניינים, חינוכיים ומתאימים לגיל עם שפה עשירה, ערכים חיוביים וסיומים מרגשים.
          אתה יודע ליצור דמויות מרתקות, עלילות מושכות וכיף לקרוא.
          אתה מכיר את הסדרות הפופולריות של ילדים ויודע לכתוב בסגנון שלהן כשמתבקש.
          אתה תמיד מוודא שהסיפור מתאים בדיוק לגיל המבוקש ומכיל את המסר החינוכי באופן טבעי.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1200, // מספיק למילים לסיפור טוב
      temperature: 0.85, // יצירתיות גבוהה אבל לא יותר מדי
      response_format: { type: "json_object" },
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    const response = completion.choices[0].message.content;
    let storyData;
    
    try {
      storyData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // בדיקה מקיפה שהתגובה תקינה ומלאה
    if (!storyData.title || !storyData.story) {
      throw new Error('Missing title or story in response');
    }

    // בדיקת איכות התוכן
    if (storyData.title.length < 5 || storyData.story.length < 100) {
      throw new Error('Response too short - story quality check failed');
    }

    // החזרת הסיפור המוכן
    return res.status(200).json({
      title: storyData.title.trim(),
      story: storyData.story.trim()
    });

  } catch (error) {
    console.error('Error generating story:', error);
    
    // התמודדות מפורטת עם שגיאות שונות
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'המכסה של OpenAI הסתיימה. אנא בדוק את הגדרות החיוב.',
        details: 'OpenAI quota exceeded. Please check your billing settings.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'מפתח API לא תקין. אנא בדוק את ההגדרות.',
        details: 'Invalid OpenAI API key. Please check your environment variables.'
      });
    }

    if (error.code === 'model_not_found') {
      return res.status(400).json({ 
        error: 'המודל לא נמצא. אנא בדוק את ההגדרות.',
        details: 'OpenAI model not found or not accessible.'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'יותר מדי בקשות. אנא נסה שוב בעוד כמה רגעים.',
        details: 'Rate limit exceeded. Please try again in a few moments.'
      });
    }

    // שגיאה כללית
    return res.status(500).json({ 
      error: 'לא הצלחתי ליצור סיפור כרגע. אנא נסה שוב.', 
      details: 'Failed to generate story. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
}
