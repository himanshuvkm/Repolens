"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldCheck, AlertTriangle } from "lucide-react";

interface Props {
  score: number;
}

export function MaintenanceScore({ score }: Props) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color and status
  let colorClass = "text-green-500";
  let bgClass = "bg-green-500/10 border-green-500/20";
  let statusText = "Excellent";
  let Icon = ShieldCheck;

  if (score < 50) {
    colorClass = "text-red-500";
    bgClass = "bg-red-500/10 border-red-500/20";
    statusText = "Poorly Maintained";
    Icon = AlertTriangle;
  } else if (score < 80) {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-500/10 border-yellow-500/20";
    statusText = "Needs Attention";
    Icon = Activity;
  }

  // SVG Circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className={`p-6 rounded-2xl border ${bgClass} flex flex-col items-center justify-center text-center relative overflow-hidden h-full group`}>
      <div className="absolute top-4 left-4">
        <Icon className={`w-5 h-5 ${colorClass} opacity-60`} />
      </div>
      <h3 className="text-gray-400 font-medium text-sm mt-3 mb-6 uppercase tracking-wider">Maintenance Health</h3>
      
      <div className="relative flex items-center justify-center w-32 h-32 mb-4 group-hover:scale-105 transition-transform duration-500">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={`${colorClass} transition-all duration-1500 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold tracking-tighter ${colorClass}`}>
            {currentScore}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">/ 100</span>
        </div>
      </div>
      
      <p className={`font-semibold ${colorClass} text-lg`}>{statusText}</p>
    </div>
  );
}
