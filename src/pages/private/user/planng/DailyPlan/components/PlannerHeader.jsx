import React, { useState, useEffect } from 'react';

export default function PlannerHeader() {
  const fullText = "Organize your schedule, tasks, and habits with AI...";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (!isDeleting && index < fullText.length) {
      // Typing
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 70); // Typing speed
    } else if (isDeleting && index > 0) {
      // Deleting
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, 40); // Deleting speed
    } else if (!isDeleting && index === fullText.length) {
      // Pause at full text
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && index === 0) {
      // Pause before restarting typing
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [index, isDeleting, fullText]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planner Board</h1>
      <p className="text-base text-gray-400 dark:text-gray-500 mt-0.5 min-h-[24px] flex items-center">
        <span>{displayedText}</span>
      </p>
    </div>
  );
}

