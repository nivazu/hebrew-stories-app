import React, { useState } from 'react';
import Head from 'next/head';

// מדמה את lucide-react icons עם emoji
const BookOpen = () => <span style={{fontSize: '24px'}}>📚</span>;
const Sparkles = () => <span style={{fontSize: '24px'}}>✨</span>;
const Heart = () => <span style={{fontSize: '24px'}}>❤️</span>;
const Printer = () => <span style={{fontSize: '24px'}}>🖨️</span>;
const Wand2 = () => <span style={{fontSize: '24px'}}>🪄</span>;
const Star = () => <span style={{fontSize: '24px'}}>⭐</span>;

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
    { value: '2-4', label: '2-4 שנים' },
    { value: '5-7', label: '5-7 שנים' },
    { value: '8-10', label: '8-10 שנים' },
    { value: '11-13', label: '11-13 שנים' }
  ];

  const genderOptions = [
    { value: 'boy', label: 'ילד' },
    { value: 'girl', label: 'ילדה' },
    { value: 'neutral', label: 'לא משנה' }
  ];

  const styleOptions = [
    { value: 'funny', label: 'מצחיק 😄' },
    { value: 'adventure', label: 'הרפתקה 🗺️' },
    { value: 'educational', label: 'חינוכי 📚' },
    { value: 'magical', label: 'קסום ✨' },
    { value: 'friendship', label: 'חברות 🤝' }
  ];

  const seriesOptions = [
    { value: 'original', label: 'סיפור חדש ומקורי' },
    { value: 'pip-posy', label: 'פיפ ופוזי (Pip and Posy)' },
    { value: 'little-bear', label: 'דוב קטן (Little Bear)' },
    { value: 'winnie', label: 'פו הדוב' },
    { value: 'sesame', label: 'רחוב סומסום' }
  ];

  const lessonOptions = [
    { value: 'sharing', label: 'שיתוף וגמילות חסדים' },
    { value: 'honesty', label: 'כנות ואמת' },
    { value: 'courage', label: 'אומץ והתמודדות עם פחדים' },
    { value: 'friendship', label: 'חברות וקבלת השונה' },
    { value: 'responsibility', label: 'אחריות וטיפול' },
    { value: 'perseverance', label: 'התמדה ואי וויתור' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStory = async () => {
    if (!formData.age || !formData.style) {
      alert('אנא בחר לפחות גיל וסגנון סיפור');
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
      alert('מצטער, הייתה בעיה ביצירת הסיפור. אנא נסה שוב.');
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
        <title>מחולל סיפורי ילדים בעברית</title>
        <meta name="description" content="צור סיפורים מותאמים אישית לילדים בעברית" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf2f8 50%, #dbeafe 100%)',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="print-hidden">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BookOpen />
              <Sparkles />
              <Heart />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              מחולל סיפורי ילדים בעברית
            </h1>
            <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
              ליצור סיפורים מותאמים אישית לילדים שלכם
            </p>
          </div>

          {!story ? (
            /* Form Section */
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '2rem'
            }} className="print-hidden">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Age Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.25rem'
                  }}>
                    <Star />
                    גיל הילד/ה
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">בחר גיל</option>
                    {ageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right'
                  }}>
                    מגדר הדמות הראשית
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">בחר מגדר</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right'
                  }}>
                    תחומי עניין
                  </label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="לדוגמא: דינוזאורים, נסיכות, ספורט, בעלי חיים..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Style */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.25rem'
                  }}>
                    <Star />
                    סגנון הסיפור
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">בחר סגנון</option>
                    {styleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Series */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right'
                  }}>
                    סדרת סיפורים
                  </label>
                  <select
                    value={formData.series}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">בחר סדרה</option>
                    {seriesOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Educational Lesson */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    textAlign: 'right'
                  }}>
                    לקח חינוכי
                  </label>
                  <select
                    value={formData.lesson}
                    onChange={(e) => handleInputChange('lesson', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">בחר לקח</option>
                    {lessonOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  onClick={generateStory}
                  disabled={isGenerating || !formData.age || !formData.style}
                  style={{
                    background: isGenerating || !formData.age || !formData.style 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '1rem 2rem',
                    borderRadius: '1rem',
                    border: 'none',
                    fontSize: '1.125rem',
                    cursor: isGenerating || !formData.age || !formData.style ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto'
                  }}
                  onMouseOver={(e) => {
                    if (!isGenerating && formData.age && formData.style) {
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Wand2 />
                      יוצר סיפור קסום...
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      צור סיפור!
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Story Display */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Story Content */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '2rem'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#6b21a8',
                    marginBottom: '1rem',
                    direction: 'rtl'
                  }}>
                    {storyTitle}
                  </h2>
                  <div style={{
                    width: '96px',
                    height: '4px',
                    background: 'linear-gradient(135deg, #a855f7, #f472b6)',
                    margin: '0 auto',
                    borderRadius: '2px'
                  }} className="print-hidden"></div>
                </div>
                
                <div 
                  style={{
                    fontSize: '20px',
                    lineHeight: '1.8',
                    color: '#1f2937',
                    fontWeight: '500',
                    direction: 'rtl',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {story.split('\n').map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: '1rem', textAlign: 'right' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }} className="print-hidden">
                <button
                  onClick={printStory}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Printer />
                  הדפס סיפור
                </button>
                
                <button
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#4b5563';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#6b7280';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <BookOpen />
                  סיפור חדש
                </button>
              </div>
            </div>
          )}

          {/* Decorative Elements */}
          <div style={{
            position: 'fixed',
            top: '2.5rem',
            left: '2.5rem',
            opacity: '0.2',
            fontSize: '3rem'
          }} className="print-hidden">
            <Sparkles />
          </div>
          <div style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2.5rem',
            opacity: '0.2',
            fontSize: '3rem'
          }} className="print-hidden">
            <Heart />
          </div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            body { 
              font-family: 'Arial', sans-serif;
              direction: rtl;
            }
            .print-hidden { 
              display: none !important; 
            }
            @page { 
              margin: 2cm;
              size: A4;
            }
          }
          
          button {
            transition: all 0.2s ease;
          }
          
          select:focus, input:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          }
        `}</style>
      </div>
    </>
  );
};

export default HebrewStoryGenerator;
