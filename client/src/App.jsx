import { useState, useEffect } from 'react';

export default function App() {
  const fullText = 'Student Progress Management System';
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        setTimeout(() => {
          i = 0;
          setDisplayedText('');
        }, 5000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center text-center" style={{height: '600px'}}>
      <h1 className="text-6xl animate-bounce transition-all duration-700">
        Welcome to
      </h1>
      <h2
        className="text-4xl transition-all duration-1000 delay-500"
        style={{ minHeight: '2.5rem', letterSpacing: '1px' }}
      >
        {displayedText}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
}
