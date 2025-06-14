import { useState, useEffect } from 'react';

export default function App() {
  const fullText = 'Student Progress Management System';
  const [displayedText, setDisplayedText] = useState('');
  const [ping, setPing] = useState(false);

  useEffect(() => {
    let i = 0;
    setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        setPing(true);
        setTimeout(() => {
          setPing(false);
          setDisplayedText('');
          i = 0;
        }, 5000);
      }
    }, 100);
  }, []);

  return (
    <div
      className="w-full flex flex-col justify-center items-center text-center gap-8"
      style={{ height: '500px' }}
    >
      <h1 className="text-9xl font-bold">
        <span className="text-blue-700">TLE </span>
        <span className="text-gray-800">Eliminators</span>
      </h1>
      <h2
        className="text-6xl transition-all duration-1000 delay-500"
        style={{ minHeight: '2.5rem', letterSpacing: '1px' }}
      >
        {displayedText}
        <span className={ping ? 'animate-ping' : 'animate-none'}>|</span>
      </h2>
    </div>
  );
}