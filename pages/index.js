import React, { useState } from 'react';
import Head from 'next/head';

// אנימציות SVG components
const AnimatedBook = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="animate-float">
    <defs>
      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect x="8" y="6" width="24" height="28" rx="2" fill="url(#bookGradient)" />
    <rect x="10" y="8" width="20" height="2" rx="1" fill="white" opacity="0.8" />
    <rect x="10" y="12" width="16" height="2" rx="1" fill="white" opacity="0.6" />
    <rect x="10" y="16" width="18" height="2" rx="1" fill="white" opacity="0.6" />
    <path d="M8 6 L32 6 L32 34 L20 28 L8 34 Z" fill="url(#bookGradient)" opacity="0.9" />
  </svg>
);

const AnimatedStar = ({ delay = 0 }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="animate-twinkle" style={{animationDelay: `${delay}s`}}>
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill="url(#starGradient)" />
  </svg>
);

const AnimatedHeart = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" className="animate-pulse-gentle">
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M16 28c-1 0-2-.5-2.5-1.5C10 22 4 16 4 10c0-4 3-7 7-7 2 0 4 1 5 2 1-1 3-2 5-2 4 0 7 3 7 7 0 6-6 12-9.5 16.5-.5 1-1.5 1.5-2.5 1.5z" 
          fill="url(#heartGradient)" />
  </svg>
);

const MagicWand = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="animate-magic-wand">
    <defs>
      <linearGradient id="wandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M3 21l3-3L18 6l3-3-3-3-3 3L3 15l-3 3 3 3z" fill="url(#wandGradient)" />
    <circle cx="19" cy="5" r="2" fill="#fbbf24" className="animate-sparkle" />
    <circle cx="17" cy="3" r="1" fill="#f59e0b" className="animate-sparkle" style={{animationDelay: '0.5s'}} />
    <circle cx="21" cy="7" r="1" fill="#fbbf24" className="animate-sparkle" style={{animationDelay: '1s'}} />
  </svg>
);

const FloatingElements = () => (
  <div className="floating-elements">
    <div className="floating-element floating-1">✨</div>
    <div className="floating-element floating-2">🌙</div>
    <div className="floating-element floating-3">⭐</div>
    <div className="floating-element floating-4">📚</div>
    <div className="floating-element floating-5">🦄</div>
    <div className="floating-element floating-6">🌈</div>
  </div>
);

const HebrewStoryGenerator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    interests: '',
    style: '',
    series: '',
    lesson: ''
  });
  
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');

  const ageOptions = [
    { value: '2-4', label: '2-4 שנים - גיל הזהב' },
    { value: '5-7', label: '5-7 שנים - קוראים ראשונים' },
    { value: '8-10', label: '8-10 שנים - הרפתקנים צעירים' },
    { value: '11-13', label: '11-13 שנים - חוקרי עולמות' }
  ];

  const genderOptions = [
    { value: 'boy', label: 'ילד 👦' },
    { value: 'girl', label: 'ילדה 👧' },
    { value: 'neutral', label: 'לא משנה 🌟' }
  ];

  const styleOptions = [
    { value: 'funny', label: 'מצחיק ושובב 😄' },
    { value: 'adventure', label: 'הרפתקה מרגשת 🗺️' },
    { value: 'educational', label: 'חינוכי ומעשיר 📚' },
    { value: 'magical', label: 'קסום ופנטסטי ✨' },
    { value: 'friendship', label: 'חברות וחמלה 🤝' },
    { value: 'mystery', label: 'מסתורין וחקירה 🔍' }
  ];

  const lessonOptions = [
    { value: 'sharing', label: 'שיתוף וגמילות חסדים 🤲' },
    { value: 'honesty', label: 'כנות ואמינות 💎' },
    { value: 'courage', label: 'אומץ והתמודדות עם פחדים 🦁' },
    { value: 'friendship', label: 'חברות וקבלת השונה 🌈' },
    { value: 'responsibility', label: 'אחריות וטיפול 🌱' },
    { value: 'perseverance', label: 'התמדה ואי וויתור 💪' },
    { value: 'kindness', label: 'חמלה ואהבת הזולת ❤️' },
    { value: 'creativity', label: 'יצירתיות וחשיבה מקורית 🎨' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStory = async () => {
    if (!formData.age || !formData.style) {
      alert('אנא בחר לפחות גיל וסגנון סיפור 🌟');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStoryTitle(data.title);
      setStory(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('מצטער, הייתה בעיה ביצירת הסיפור. אנא נסה שוב 🌟');
    }
    
    setIsGenerating(false);
  };

  const printStory = () => {
    window.print();
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      interests: '',
      style: '',
      series: '',
      lesson: ''
    });
    setStory('');
    setStoryTitle('');
  };

  return (
    <>
      <Head>
        <title>מחולל סיפורי ילדים בעברית - הסטנדרט הזהב</title>
        <meta name="description" content="צור סיפורים מותאמים אישית לילדים בעברית עם AI מתקדם" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app-container">
        <FloatingElements />
        
        <div className="main-content">
          {/* Header Section */}
          <div className="header-section print:hidden">
            <div className="header-icons">
              <AnimatedBook />
              <AnimatedStar delay={0} />
              <AnimatedHeart />
              <AnimatedStar delay={1} />
            </div>
            
            <h1 className="main-title">
              <span className="title-gradient">מחולל סיפורי ילדים</span>
              <span className="title-hebrew">בעברית</span>
            </h1>
            
            <p className="subtitle">
              ✨ ליצור סיפורים קסומים ומותאמים אישית לילדים שלכם ✨
            </p>
            
            <div className="decorative-line"></div>
          </div>

          {!story ? (
            /* Form Section */
            <div className="form-container print:hidden">
              <div className="form-grid">
                {/* Age Selection */}
                <div className="input-group">
                  <label className="input-label">
                    <AnimatedStar delay={0} />
                    גיל הילד/ה
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="select-input required"
                  >
                    <option value="">🌟 בחר גיל</option>
                    {ageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender Selection */}
                <div className="input-group">
                  <label className="input-label">
                    מגדר הדמות הראשית
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="select-input"
                  >
                    <option value="">👤 בחר מגדר</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interests */}
                <div className="input-group">
                  <label className="input-label">
                    תחומי עניין וחוביות
                  </label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="לדוגמא: דינוזאורים, נסיכות, ספורט, בעלי חיים, מדע..."
                    className="text-input"
                  />
                </div>

                {/* Style */}
                <div className="input-group">
                  <label className="input-label">
                    <AnimatedStar delay={0.5} />
                    סגנון הסיפור
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="select-input required"
                  >
                    <option value="">🎭 בחר סגנון</option>
                    {styleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Series - Free Text Input */}
                <div className="input-group">
                  <label className="input-label">
                    סדרת סיפורים (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={formData.series}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    placeholder="לדוגמא: פיפ ופוזי, דוב קטן, תומס הקטר, אלמוג הקטן..."
                    className="text-input"
                  />
                  <div className="input-help">
                    השאר ריק לסיפור מקורי, או הזן כל סדרת ילדים שתרצה
                  </div>
                </div>

                {/* Educational Lesson */}
                <div className="input-group">
                  <label className="input-label">
                    לקח חינוכי (אופציונלי)
                  </label>
                  <select
                    value={formData.lesson}
                    onChange={(e) => handleInputChange('lesson', e.target.value)}
                    className="select-input"
                  >
                    <option value="">💎 בחר לקח</option>
                    {lessonOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="button-container">
                <button
                  onClick={generateStory}
                  disabled={isGenerating || !formData.age || !formData.style}
                  className="generate-button"
                >
                  {isGenerating ? (
                    <div className="button-content">
                      <MagicWand />
                      <span>יוצר סיפור קסום...</span>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ) : (
                    <div className="button-content">
                      <AnimatedStar delay={0} />
                      <span>צור סיפור קסום!</span>
                      <MagicWand />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Story Display */
            <div className="story-container">
              {/* Story Content */}
              <div className="story-card">
                <div className="story-header">
                  <h2 className="story-title">
                    {storyTitle}
                  </h2>
                  <div className="story-decorative-line"></div>
                  <div className="story-stars">
                    <AnimatedStar delay={0} />
                    <AnimatedStar delay={0.5} />
                    <AnimatedStar delay={1} />
                  </div>
                </div>
                
                <div className="story-content">
                  {story.split('\n').map((paragraph, index) => (
                    <p key={index} className="story-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="story-footer">
                  <div className="story-end-decoration">
                    <AnimatedHeart />
                    <span>סוף טוב לסיפור יפה</span>
                    <AnimatedHeart />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons print:hidden">
                <button onClick={printStory} className="action-button print-button">
                  <span>🖨️</span>
                  הדפס סיפור
                </button>
                
                <button onClick={resetForm} className="action-button new-story-button">
                  <AnimatedBook />
                  סיפור חדש
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Styles */}
        <style jsx>{`
          .app-container {
            min-height: 100vh;
            background: linear-gradient(135deg, 
              #667eea 0%, 
              #764ba2 25%, 
              #f093fb 50%, 
              #f5576c 75%, 
              #4facfe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            font-family: 'Assistant', 'Arial', sans-serif;
            position: relative;
            overflow-x: hidden;
          }

          .floating-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .floating-element {
            position: absolute;
            font-size: 2rem;
            opacity: 0.3;
            animation: float 10s ease-in-out infinite;
          }

          .floating-1 { top: 10%; left: 10%; animation-delay: 0s; }
          .floating-2 { top: 20%; right: 15%; animation-delay: 2s; }
          .floating-3 { top: 60%; left: 5%; animation-delay: 4s; }
          .floating-4 { bottom: 30%; right: 10%; animation-delay: 6s; }
          .floating-5 { top: 70%; right: 25%; animation-delay: 8s; }
          .floating-6 { bottom: 15%; left: 20%; animation-delay: 10s; }

          .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            position: relative;
            z-index: 2;
          }

          .header-section {
            text-align: center;
            margin-bottom: 3rem;
          }

          .header-icons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .main-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          .title-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: block;
          }

          .title-hebrew {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: block;
          }

          .subtitle {
            font-size: 1.25rem;
            color: white;
            margin-bottom: 2rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .decorative-line {
            width: 120px;
            height: 4px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            margin: 0 auto;
            border-radius: 2px;
            animation: pulse-gentle 2s ease-in-out infinite;
          }

          .form-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 2rem;
            padding: 3rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .input-label {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .select-input, .text-input {
            padding: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 1rem;
            font-size: 1rem;
            text-align: right;
            background: white;
            transition: all 0.3s ease;
            outline: none;
          }

          .select-input:focus, .text-input:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
            transform: translateY(-2px);
          }

          .required {
            border-color: #f59e0b;
          }

          .input-help {
            font-size: 0.875rem;
            color: #6b7280;
            text-align: right;
            font-style: italic;
          }

          .button-container {
            text-align: center;
          }

          .generate-button {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            font-weight: 700;
            font-size: 1.25rem;
            padding: 1.5rem 3rem;
            border-radius: 2rem;
            border: none;
            cursor: pointer;
            box-shadow: 0 15px 35px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .generate-button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
          }

          .generate-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }

          .loading-dots {
            display: flex;
            gap: 0.25rem;
          }

          .loading-dots span {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: loading-bounce 1.4s ease-in-out infinite both;
          }

          .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
          .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

          .story-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .story-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 2rem;
            padding: 3rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .story-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .story-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #6b21a8;
            margin-bottom: 1.5rem;
            direction: rtl;
            line-height: 1.3;
          }

          .story-decorative-line {
            width: 150px;
            height: 4px;
            background: linear-gradient(135deg, #a855f7, #f472b6);
            margin: 0 auto 1rem;
            border-radius: 2px;
          }

          .story-stars {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }

          .story-content {
            font-size: 1.375rem;
            line-height: 1.8;
            color: #1f2937;
            direction: rtl;
            text-align: right;
          }

          .story-paragraph {
            margin-bottom: 1.5rem;
            padding: 0.5rem 0;
          }

          .story-footer {
            margin-top: 3rem;
            text-align: center;
          }

          .story-end-decoration {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 1.125rem;
            color: #6b21a8;
            font-weight: 600;
          }

          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
          }

          .action-button {
            padding: 1rem 2rem;
            border-radius: 1rem;
            border: none;
            font-weight: 600;
            font-size: 1.125rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }

          .print-button {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
          }

          .new-story-button {
            background: linear-gradient(135deg, #6b7280, #374151);
            color: white;
          }

          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          }

          /* Animations */
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes animate-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes animate-twinkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
          }

          @keyframes animate-pulse-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes animate-magic-wand {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
          }

          @keyframes animate-sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
          }

          @keyframes pulse-gentle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @keyframes loading-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }

          /* Print Styles */
          @media print {
            .app-container {
              background: white !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .story-card {
              box-shadow: none;
              border: none;
              background: white;
            }
            
            .story-content {
              font-size: 18px;
              line-height: 1.6;
            }
            
            @page {
              margin: 2cm;
              size: A4;
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .main-content {
              padding: 1rem;
            }
            
            .form-container {
              padding: 2rem;
            }
            
            .form-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            
            .action-buttons {
              flex-direction: column;
              align-items: center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default HebrewStoryGenerator;
