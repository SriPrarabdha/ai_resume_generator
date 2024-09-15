import React from 'react'

interface ProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '', indicatorClassName = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`bg-indigo-600 h-2.5 rounded-full ${indicatorClassName}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}