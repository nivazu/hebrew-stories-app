import OpenAI from 'openai';
import { identifySeries, createSeriesAwarePrompt } from '../../utils/seriesKnowledge.js';

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
    const { title, style, interests, series, age, scenes, seriesInfo } = req.body;

    // בדיקת שדות חובה
    if (!title || !style) {
      return res.status(400).json({ error: 'Title and style are required' });
    }

    console.log('Generating images for story:', title);
    console.log('Number of scenes:', scenes ? scenes.length : 1);
    console.log('Series detected:', seriesInfo ? seriesInfo.name : 'None');

    // זיהוי סדרה אם לא הועברה כבר
    const identifiedSeries = seriesInfo || (series ? identifySeries(series) : null);

    const images = [];
    const maxImages = Math.min(scenes ? scenes.length : 1, 4); // מקסימום 4 תמונות

    // יצירת תמונה לכל סצנה
    for (let i = 0; i < maxImages; i++) {
      const scene = scenes && scenes[i] ? scenes[i] : { content: title, summary: title };
      
      try {
        const imagePrompt = createSceneImagePrompt(
          scene,
          title,
          style,
          interests,
          identifiedSeries,
          age,
          i + 1,
          maxImages
        );

        console.log(`Generating image ${i + 1}/${maxImages} with prompt:`, imagePrompt.substring(0, 100) + '...');

        // יצירת תמונה עם DALL-E
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        });

        const imageUrl = imageResponse.data[0].url;
        
        images.push({
          sceneNumber: i + 1,
          imageUrl: imageUrl,
          sceneContent: scene.content,
          sceneSummary: scene.summary || scene.content.substring(0, 100),
          prompt: imagePrompt
        });

        // הפסקה קצרה בין יצירת תמונות כדי לא להעמיס על ה-API
        if (i < maxImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (imageError) {
        console.error(`Error generating image ${i + 1}:`, imageError);
        
        // במקרה של כשל ביצירת תמונה, נמשיך עם התמונות האחרות
        images.push({
          sceneNumber: i + 1,
          imageUrl: null,
          sceneContent: scene.content,
          sceneSummary: scene.summary || scene.content.substring(0, 100),
          error: imageError.message,
          fallback: true
        });
      }
    }

    // בדיקה שנוצרה לפחות תמונה אחת
    const successfulImages = images.filter(img => img.imageUrl);
    
    if (successfulImages.length === 0) {
      throw new Error('Failed to generate any images');
    }

    console.log(`Successfully generated ${successfulImages.length}/${maxImages} images`);

    // החזרת התמונות
    return res.status(200).json({
      images: images,
      totalImages: images.length,
      successfulImages: successfulImages.length,
      seriesDetected: identifiedSeries ? identifiedSeries.name : null
    });

  } catch (error) {
    console.error('Error generating images:', error);
    
    // התמודדות עם שגיאות שונות
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'המכסה של OpenAI הסתיימה לתמונות.',
        details: 'OpenAI image quota exceeded.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'מפתח API לא תקין.',
        details: 'Invalid OpenAI API key.'
      });
    }

    if (error.code === 'content_policy_violation') {
      return res.status(400).json({ 
        error: 'התוכן אינו עומד במדיניות OpenAI.',
        details: 'Content policy violation.'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'יותר מדי בקשות לתמונות. אנא נסה שוב בעוד כמה רגעים.',
        details: 'Rate limit exceeded for images.'
      });
    }

    // שגיאה כללית - לא נכשל כל התהליך בגלל תמונות
    return res.status(500).json({ 
      error: 'לא הצלחתי ליצור תמונות כרגע.',
      details: 'Failed to generate images. Story will continue without images.',
      timestamp: new Date().toISOString()
    });
  }
}

// פונקציה ליצירת פרומפט מותאם לסצנה ספציפית
function createSceneImagePrompt(scene, title, style, interests, identifiedSeries, age, sceneNumber, totalScenes) {
  let basePrompt = `A beautiful, child-friendly illustration for scene ${sceneNumber} of ${totalScenes} from a Hebrew children's story`;
  
  // אם זוהתה סדרה - שימוש בסגנון הסדרה
  if (identifiedSeries) {
    const seriesPrompts = createSeriesAwarePrompt(identifiedSeries, {});
    basePrompt = `Scene ${sceneNumber} of ${totalScenes} ${seriesPrompts.visualPrompt}`;
    
    // הוספת הדמויות הספציפיות של הסדרה
    const mainCharacters = identifiedSeries.characters.main.map(char => 
      `${char.name} (${char.appearance})`
    ).join(', ');
    
    basePrompt += `, featuring ${mainCharacters}`;
    
    // הוספת הגדרות ויזואליות של הסדרה
    basePrompt += `, ${identifiedSeries.visualStyle.artStyle}`;
    basePrompt += `, ${identifiedSeries.visualStyle.colors}`;
    basePrompt += `, setting: ${identifiedSeries.visualStyle.setting}`;
    basePrompt += `, mood: ${identifiedSeries.visualStyle.mood}`;
    
  } else {
    // פרומפט כללי לסיפור מקורי
    if (title) {
      basePrompt += ` titled "${title}"`;
    }

    // הוספת סגנון
    const styleDescriptions = {
      'funny': 'whimsical, colorful, cartoon-style, humorous, playful',
      'adventure': 'exciting, dynamic, adventurous landscape, action-packed',
      'educational': 'clear, informative, bright colors, learning-focused, engaging',
      'magical': 'magical, fantasy, sparkles, dreamy, enchanted, mystical',
      'friendship': 'warm, friendly, characters together, heart-warming, loving',
      'mystery': 'intriguing, gentle mystery, child-appropriate suspense, curious'
    };
    
    if (styleDescriptions[style]) {
      basePrompt += `, ${styleDescriptions[style]}`;
    }

    // הוספת תחומי עניין
    if (interests) {
      const interestPrompts = {
        'דינוזאור': 'with friendly dinosaurs in prehistoric landscape',
        'dinosaur': 'with friendly dinosaurs in prehistoric landscape',
        'נסיכ': 'with princesses, castles, and fairy tale elements',
        'princess': 'with princesses, castles, and fairy tale elements',
        'חלל': 'with space, rockets, planets, and cosmic elements',
        'space': 'with space, rockets, planets, and cosmic elements',
        'בעלי חיים': 'with cute animals in natural habitat',
        'animal': 'with cute animals in natural habitat',
        'מדע': 'with science elements, experiments, and discovery',
        'science': 'with science elements, experiments, and discovery',
        'ספורט': 'with sports activities and athletic scenes',
        'sport': 'with sports activities and athletic scenes'
      };

      for (const [key, value] of Object.entries(interestPrompts)) {
        if (interests.toLowerCase().includes(key.toLowerCase())) {
          basePrompt += ` ${value}`;
          break;
        }
      }
    }
  }

  // הוספת פרטי הסצנה הספציפית
  if (scene.summary) {
    basePrompt += `, depicting: ${scene.summary}`;
  }

  // התאמה לגיל
  const agePrompts = {
    '2-4': 'very simple, large clear shapes, bright primary colors, minimal details',
    '5-7': 'detailed but not complex, vibrant colors, engaging characters, clear focus',
    '8-10': 'detailed illustration, rich colors, adventure elements, more sophisticated',
    '11-13': 'sophisticated illustration, detailed background, complex story elements'
  };

  if (agePrompts[age]) {
    basePrompt += `, ${agePrompts[age]}`;
  }

  // הוספת מאפיינים לסצנה בסדרה
  if (sceneNumber === 1) {
    basePrompt += ', opening scene, introducing characters and setting';
  } else if (sceneNumber === totalScenes) {
    basePrompt += ', final scene, happy ending, resolution';
  } else {
    basePrompt += ', middle scene, story development, character interaction';
  }

  // הוספת דרישות כלליות
  basePrompt += `, safe for children, no scary elements, warm and inviting, digital art style, high quality, perfect for children's book illustration`;

  // אם זה סיפור בסדרה - הוסף דרישה לדיוק
  if (identifiedSeries) {
    basePrompt += `, must be exactly in the style of original ${identifiedSeries.englishName} illustrations, character accuracy is crucial`;
  }

  // הגבלת אורך (DALL-E 3 has limit)
  if (basePrompt.length > 1000) {
    basePrompt = basePrompt.substring(0, 997) + '...';
  }

  return basePrompt;
}
