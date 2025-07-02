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
    let finalPrompt;
    
    if (series && series.trim()) {
      // פרומפט מותאם לסדרה ספציפית - נתן ל-GPT להשתמש בידע שלו
      finalPrompt = `אתה מומחה לסדרות ספרי ילדים ואתה חייב ליצור סיפור שהוא 100% נאמן לסדרה "${series}".

דרישות קריטיות לנאמנות מוחלטת לסדרה:

1. דמויות - חובה לשמור בדיוק על:
   - מין הדמויות (ארנב, עכבר, קטר וכו') - לא לשנות לילדים אנושיים!
   - שמות הדמויות המקוריות מהסדרה
   - תכונות פיזיות וחזותיות של הדמויות
   - אישיות ודרך התנהגות של כל דמות
   
2. עולם הסדרה - חובה לשמור על:
   - הסביבה והמקומות המוכרים מהסדרה
   - סוג הפעילויות והמצבים שמתרחשים בסדרה
   - האווירה והטון של הסדרה המקורית
   
3. סגנון כתיבה - חובה לחקות:
   - את הטון והקצב של הסדרה המקורית
   - את סוג השפה והמילים שמשמשות בסדרה
   - את מבנה הסיפורים האופייני לסדרה

לדוגמה: אם הסדרה היא "פיפ ופוזי" - פיפ הוא ארנב ופוזי היא עכברה, לא ילדים אנושיים!

מידע נוסף על הסיפור המבוקש:
גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה - אבל שמור על המין המקורי של הדמות מהסדרה'}
תחומי עניין נוספים: ${interests || 'בהתאם לסדרה'}
סגנון מבוקש: ${style}
לקח חינוכי: ${lesson || 'בהתאם לרוח הסדרה'}

אתה חייב ליצור סיפור שמשתמש רק בדמויות המקוריות מהסדרה "${series}" בדיוק כמו שהן מתוארות בספרים המקוריים.

אם לא אתה יודע בדיוק מיהן הדמויות בסדרה "${series}", אל תמציא - השתמש בידע שלך או דווח שאתה לא מכיר את הסדרה.

חלק את הסיפור ל-3-4 סצנות נפרדות עם מעבר שורה כפול בין כל סצנה.
כל סצנה צריכה להיות עצמאית ומתאימה לתמונה נפרדת.

הסיפור חייב להרגיש כאילו הוא חלק רשמי מהסדרה "${series}".`;

    } else {
      // פרומפט כללי לסיפור מקורי
      finalPrompt = `צור סיפור ילדים מרהיב בעברית עם הפרטים הבאים:

גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה'}
תחומי עניין וחוביות: ${interests || 'כללי'}
סגנון הסיפור: ${style}
לקח חינוכי: ${lesson || 'כללי'}

דרישות הסיפור המתקדמות:
- כתוב בעברית תקנית עם ניקוד חלקי במילים מורכבות
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
  "seriesDetected": ${series && series.trim() ? `"${series.trim()}"` : 'null'},
  "sceneCount": "מספר הסצנות בסיפור (3-4)",
  "visualStyle": "תיאור קצר של הסגנון הויזואלי שמתאים לסיפור זה - צבעים, אווירה, סגנון איור"
}

תוודא שהסיפור מרתק, מעניין, מתאים בדיוק לגיל שנבחר, ומעביר את הלקח החינוכי באופן טבעי, מהנה וזוכר.`;

    // שליחה ל-OpenAI עם הגדרות מותאמות
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `אתה כותב סיפורי ילדים מקצועי ומומחה ביצירה בעברית.
          ${series && series.trim() ? 
            `אתה מכיר לעומק את כל סדרות ספרי הילדים בעולם, כולל "${series}".
            
            חשוב קריטי: כאשר אתה כותב בסגנון סדרה מסוימת, אתה חייב לשמור על נאמנות מוחלטת:
            - הדמויות חייבות להישאר כמו שהן במקור (ארנב נשאר ארנב, עכבר נשאר עכבר)
            - אסור לשנות דמויות בעלי חיים לילדים אנושיים
            - אסור לשנות את השמות, האישיות או המאפיינים של הדמויות
            - הסיפור חייב להתרחש בעולם המקורי של הסדרה
            - הסגנון והטון חייבים להיות זהים לסדרה המקורית
            
            דוגמה: אם הסדרה היא "פיפ ופוזי" - פיפ הוא ארנב צעיר, לא ילד אנושי!
            דוגמה: אם הסדרה היא "תומס הקטר" - הדמויות הן קטרים, לא ילדים!
            
            כל סטייה מהדמויות המקוריות היא שגיאה חמורה.` :
            `אתה מתמחה ביצירת סיפורים מקוריים מעניינים, חינוכיים ומתאימים לגיל.`}
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
      seriesDetected: storyData.seriesDetected || null,
      scenes: scenes,
      sceneCount: scenes.length,
      visualStyle: storyData.visualStyle || null
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

// פונקציה לחלוקת סיפור לסצנות
function divideStoryIntoScenes(story, targetScenes = 3) {
  const sections = story.split('\n\n').filter(section => section.trim().length > 0);
  const scenes = [];
  const sectionsPerScene = Math.ceil(sections.length / targetScenes);
  
  for (let i = 0; i < targetScenes; i++) {
    const startIndex = i * sectionsPerScene;
    const endIndex = Math.min((i + 1) * sectionsPerScene, sections.length);
    const sceneContent = sections.slice(startIndex, endIndex);
    
    if (sceneContent.length > 0) {
      const content = sceneContent.join('\n\n');
      scenes.push({
        sceneNumber: i + 1,
        content: content,
        summary: content.split('.')[0] + '.' // המשפט הראשון
      });
    }
  }
  
  return scenes;
}
