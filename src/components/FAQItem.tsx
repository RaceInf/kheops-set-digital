import React, { useState } from 'react';

export default function FAQItem({ question, answer }: { 
  question: string; 
  answer: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <details 
      className="bg-gray-50 rounded-lg p-6 cursor-pointer group"
      open={isOpen}
      onClick={(e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
      }}
    >
      <summary className="font-medium flex justify-between items-center list-none">
        <span>{question}</span>
        <span className="text-yellow-400 text-xl transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      
      <p className="mt-4 text-gray-600">{answer}</p>
    </details>
  );
}
