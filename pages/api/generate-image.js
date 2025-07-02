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
    const { title, style, interests, series, age, scenes, visualStyle } = req.body;

    // בדיקת שדות חובה
    if (!title || !style) {
      return res.status(400).json({ error: 'Title and style are required' });
    }

    console.log('Generating images for story:', title);
    console.log('Series:', series || 'Original story');
    console.log('Number of scenes:', scenes ? scenes.length : 1);

    const images = [];
    const maxImages = Math.min(scenes ? scenes.length : 1, 4); // מקסימום 4 תמונות

    // יצירת תמונה לכל סצנה
    for (let i = 0; i < maxImages; i++) {
      const scene = scenes && scenes[i] ? scenes[i] : { content: title, summary: title };
      
      try {
        // יצירת פרומפט מתקדם
        const imagePrompt = createImagePrompt(
          scene,
          title,
          style,
          interests,
          series,
          age,
          i + 1,
          maxImages,
          visualStyle
        );

        console.log(`Generating image ${i + 1}/${maxImages}`);

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

        // הפסקה קצרה בין יצירת תמונות
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
      seriesDetected: series || null
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

// פונקציה ליצירת פרומפט מתקדם
function createImagePrompt(scene, title, style, interests, series, age, sceneNumber, totalScenes, visualStyle) {
  
  if (series && series.trim()) {
    // פרומפט מתקדם לסדרה מוכרת
    return `Create scene ${sceneNumber} of ${totalScenes} illustration in the EXACT visual style of "${series}" children's book series.

CRITICAL REQUIREMENTS for absolute series accuracy:
- Use ONLY the original characters from "${series}" exactly as they appear in the official books
- Characters must maintain their original species/type (if Pip is a rabbit, he stays a rabbit - NOT a human child)
- Use the exact character designs, colors, and proportions from the "${series}" series
- Match the original illustration style of "${series}" perfectly - art style, line work, composition
- Use the authentic color palette from the "${series}" series
- The setting and environment must match the world of "${series}"
- Maintain the original artistic mood and atmosphere of "${series}"

Scene content: ${scene.summary || scene.content.substring(0, 200)}

Visual requirements:
- Must look like an official illustration from the "${series}" book series
- Character accuracy is absolutely critical - NEVER change the species or type of characters
- Age appropriate for ${age} year olds
- Scene ${sceneNumber} of story progression
- High quality, suitable for children's book printing

Style notes: ${visualStyle || 'Follow the original series style exactly'}

IMPORTANT: If "${series}" features animal characters, they must remain as animals, not human children.

This illustration must be indistinguishable from an authentic "${series}" book illustration.`;

  } else {
    // פרומפט לסיפור מקורי
    let basePrompt = `A beautiful, child-friendly illustration for scene ${sceneNumber} of ${totalScenes} from a Hebrew children's story titled "${title}"`;
    
    // הוספת סגנון
    const styleDescriptions = {
      'funny': 'whimsical, colorful, cartoon-style, humorous, playful characters with expressive faces',
      'adventure': 'exciting, dynamic, adventurous landscape, action-packed scenes with movement',
      'educational': 'clear, informative, bright colors, learning-focused, engaging and educational',
      'magical': 'magical, fantasy, sparkles, dreamy, enchanted, mystical atmosphere with wonder',
      'friendship': 'warm, friendly, characters together, heart-warming, loving and caring',
      'mystery': 'intriguing, gentle mystery, child-appropriate suspense, curious and investigative'
    };
    
    if (styleDescriptions[style]) {
      basePrompt += `, ${styleDescriptions[style]}`;
    }

    // הוספת תחומי עניין
    if (interests) {
      const interestPrompts = {
        'דינוזאור': 'with friendly, colorful dinosaurs in a lush prehistoric landscape',
        'dinosaur': 'with friendly, colorful dinosaurs in a lush prehistoric landscape',
        'נסיכ': 'with beautiful princesses, magical castles, and fairy tale elements',
        'princess': 'with beautiful princesses, magical castles, and fairy tale elements',
        'חלל': 'with rockets, planets, stars, and exciting cosmic elements',
        'space': 'with rockets, planets, stars, and exciting cosmic elements',
        'בעלי חיים': 'with cute, friendly animals in their natural colorful habitat',
        'animal': 'with cute, friendly animals in their natural colorful habitat',
        'מדע': 'with fun science elements, experiments, and discovery themes',
        'science': 'with fun science elements, experiments, and discovery themes',
        'ספורט': 'with dynamic sports activities and athletic scenes',
        'sport': 'with dynamic sports activities and athletic scenes'
      };

      for (const [key, value] of Object.entries(interestPrompts)) {
        if (interests.toLowerCase().includes(key.toLowerCase())) {
          basePrompt += ` ${value}`;
          break;
        }
      }
    }

    // הוספת פרטי הסצנה הספציפית
    if (scene.summary) {
      basePrompt += `, depicting: ${scene.summary}`;
    }

    // התאמה לגיל
    const agePrompts = {
      '2-4': 'very simple, large clear shapes, bright primary colors, minimal details, big friendly characters',
      '5-7': 'detailed but not complex, vibrant colors, engaging characters, clear focus, fun elements',
      '8-10': 'detailed illustration, rich colors, adventure elements, more sophisticated composition',
      '11-13': 'sophisticated illustration, detailed background, complex story elements, mature art style'
    };

    if (agePrompts[age]) {
      basePrompt += `, ${agePrompts[age]}`;
    }

    // הוספת מאפיינים לסצנה
    if (sceneNumber === 1) {
      basePrompt += ', opening scene, introducing characters and setting, welcoming atmosphere';
    } else if (sceneNumber === totalScenes) {
      basePrompt += ', final scene, happy ending, resolution, celebratory mood';
    } else {
      basePrompt += ', middle scene, story development, character interaction, engaging action';
    }

    // הוספת סגנון ויזואלי אם סופק
    if (visualStyle) {
      basePrompt += `, ${visualStyle}`;
    }

    // הוספת דרישות כלליות
    basePrompt += `, safe for children, no scary elements, warm and inviting atmosphere, digital art style, high quality, perfect for children's book illustration, bright and colorful`;

    return basePrompt;
  }
}
