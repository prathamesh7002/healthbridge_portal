import React from 'react';

export function DoctorIllustration() {
  return (
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
}
