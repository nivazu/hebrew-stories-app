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

    // בניית הפרומפט לOpenAI
    const prompt = `צור סיפור ילדים בעברית עם הפרטים הבאים:

גיל הקהל: ${age}
מגדר הדמות הראשית: ${gender || 'לא משנה'}
תחומי עניין: ${interests || 'כללי'}
סגנון הסיפור: ${style}
סדרת סיפורים: ${series || 'מקורי'}
לקח חינוכי: ${lesson || 'כללי'}

דרישות הסיפור:
- כתוב בעברית בלבד עם ניקוד חלקי במילים קשות
- מתאים לגיל שנבחר (${age})
- אורך של 200-400 מילים
- כולל דמויות מעניינות ורלוונטיות לתחומי העניין
- מסר חינוכי טבעי ולא כפוי
- סיום חיובי ומעורר השראה
- כולל דיאלוגים קצרים וחיים
- שפה עשירה ומתאימה לגיל

אנא החזר את התשובה בפורמט JSON הבא בלבד:
{
  "title": "כותרת הסיפור בעברית",
  "story": "תוכן הסיפור המלא בעברית"
}

תוודא שהסיפור מעניין, מתאים לגיל, ומעביר את הלקח החינוכי באופן טבעי ומהנה.`;

    // שליחה ל-OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // המודל הכי זול וטוב לטקסט
      messages: [
        {
          role: "system",
          content: "אתה כותב סיפורי ילדים מקצועי הכותב בעברית. אתה יוצר סיפורים מעניינים, חינוכיים ומתאימים לגיל עם שפה עשירה וערכים חיוביים."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8, // יצירתיות בינונית
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const storyData = JSON.parse(response);

    // בדיקה שהתגובה תקינה
    if (!storyData.title || !storyData.story) {
      throw new Error('Invalid response format from OpenAI');
    }

    // החזרת הסיפור
    return res.status(200).json({
      title: storyData.title,
      story: storyData.story
    });

  } catch (error) {
    console.error('Error generating story:', error);
    
    // התמודדות עם שגיאות שונות
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI quota exceeded. Please check your billing.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key.' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to generate story. Please try again.' 
    });
  }
}
