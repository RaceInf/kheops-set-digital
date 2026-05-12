import React from 'react';

export default function TestimonialCard({ testimonial }: {
  testimonial: {
    content: string;
    author: string;
    role: string;
  }
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="text-yellow-400 text-2xl mb-4">"</div>
      <p className="text-gray-700 mb-6 flex-1">{testimonial.content}</p>
      
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
          {testimonial.author.charAt(0)}
        </div>
        
        <div className="ml-3">
          <p className="font-medium">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
