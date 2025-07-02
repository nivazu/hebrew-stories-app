import OpenAI from 'openai';
import { identifySeries, createSeriesAwarePrompt, divideStoryIntoScenes } from '../../utils/seriesKnowledge.js';

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

    // זיהוי סדרת סיפורים אם הוזנה
    const identifiedSeries = series ? identifySeries(series) : null;
    
    console.log('Identified series:', identifiedSeries ? identifiedSeries.name : 'None');

    // בניית הפרומפט בהתאם לסדרה או כללי
    let finalPrompt;
    
    if (identifiedSeries) {
      // פרומפט מותאם לסדרה ספציפית
      const seriesPrompts = createSeriesAwarePrompt(identifiedSeries, { age, gender, interests, style, lesson });
      
      finalPrompt = `${seriesPrompts.storyPrompt}

מידע נוסף על הסיפור המבוקש:
גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה'}
תחומי עניין נוספים: ${interests || 'בהתאם לסדרה'}
סגנון מבוקש: ${style}
לקח חינוכי: ${lesson || 'בהתאם לרוח הסדרה'}

צור סיפור שהוא 100% נאמן לסדרת ${identifiedSeries.name}, עם הדמויות המקוריות והסגנון המדויק.
הסיפור חייב להרגיש כאילו הוא חלק רשמי מהסדרה.

חשוב מאוד: חלק את הסיפור ל-3-4 סצנות נפרדות עם מעבר שורה כפול בין כל סצנה.
כל סצנה צריכה להיות עצמאית ומתאימה לתמונה נפרדת.`;

    } else {
      // פרומפט כללי לסיפור מקורי
      finalPrompt = `צור סיפור ילדים מרהיב בעברית עם הפרטים הבאים:

גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה'}
תחומי עניין וחוביות: ${interests || 'כללי'}
סגנון הסיפור: ${style}
סדרת סיפורים מבוקשת: ${series || 'סיפור מקורי וחדש'}
לקח חינוכי: ${lesson || 'כללי'}

דרישות הסיפור המתקדמות:
- כתוב בעברית תקנית עם ניקוד חלקי במילים מורכבות לשיפור הקריאות
- מתאים בדיוק לגיל שנבחר (${age}) - רמת השפה, האורך והמורכבות
- אורך של 300-600 מילים (בהתאם לגיל: צעירים יותר = קצר יותר)
- חלק את הסיפור ל-3-4 סצנות נפרדות עם מעבר שורה כפול בין כל סצנה
- כל סצנה צריכה להיות עצמאית ומתאימה לתמונה נפרדת
- כולל דמויות חיות, מעניינות וייחודיות שקשורות לתחומי העניין
- מסר חינוכי טבעי שזורג באופן אורגני בעלילה ללא דידקטיות
- סיום מרגש, מעורר השראה וחיובי שמשאיר רושם
- דיאלוגים קצרים, טבעיים וחיים המתאימים לגיל
- שפה עשירה, יפה ומדויקת עם מילים מעוררות דמיון
- אווירה חמה, אוהבת ובטוחה המתאימה לקריאה לפני השינה
- מבנה ברור עם התחלה מעניינת, התפתחות והסתיימות מספקת`;
    }

    finalPrompt += `

חשוב מאוד: אנא החזר את התשובה בפורמט JSON הבא בלבד:
{
  "title": "כותרת הסיפור בעברית - יצירתית, מושכת ומתאימה לגיל",
  "story": "תוכן הסיפור המלא בעברית מחולק לסצנות עם מעבר שורה כפול בין סצנות",
  "seriesDetected": ${identifiedSeries ? `"${identifiedSeries.name}"` : 'null'},
  "sceneCount": "מספר הסצנות בסיפור (3-4)"
}

תוודא שהסיפור מרתק, מעניין, מתאים בדיוק לגיל שנבחר, ומעביר את הלקח החינוכי באופן טבעי, מהנה וזוכר.`;

    // שליחה ל-OpenAI עם הגדרות מותאמות
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `אתה כותב סיפורי ילדים מקצועי ומומחה ביצירה בעברית.
          ${identifiedSeries ? 
            `אתה מכיר לעומק את סדרת ${identifiedSeries.name} ויודע לכתוב בסגנון המדויק שלה.
            אתה חייב לשמור על נאמנות מוחלטת לדמויות, לסגנון ולרוח של הסדרה המקורית.
            הדמויות חייבות להתנהג בדיוק כמו בסדרה, השפה חייבת להיות זהה, והסיטואציות מתאימות לעולם של הסדרה.` :
            `אתה מתמחה ביצירת סיפורים מקוריים מעניינים, חינוכיים ומתאימים לגיל עם שפה עשירה, ערכים חיוביים וסיומים מרגשים.`}
          אתה יודע ליצור דמויות מרתקות, עלילות מושכות וכיף לקרוא.
          אתה תמיד מוודא שהסיפור מתאים בדיוק לגיל המבוקש ומכיל את המסר החינוכי באופן טבעי.
          אתה חובר את הסיפור לסצנות נפרדות המתאימות ליצירת תמונות.`
        },
        {
          role: "user",
          content: finalPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.85,
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

    // חלוקת הסיפור לסצנות לתמונות
    const scenes = divideStoryIntoScenes(storyData.story, parseInt(storyData.sceneCount) || 3);

    // החזרת הסיפור המוכן עם מידע על הסדרה
    return res.status(200).json({
      title: storyData.title.trim(),
      story: storyData.story.trim(),
      seriesDetected: identifiedSeries ? identifiedSeries.name : null,
      seriesInfo: identifiedSeries || null,
      scenes: scenes,
      sceneCount: scenes.length
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
