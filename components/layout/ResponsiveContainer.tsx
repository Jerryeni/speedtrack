import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * ResponsiveContainer - A reusable layout wrapper component that provides
 * consistent responsive padding and max-width constraints across the application.
 * 
 * Features:
 * - Responsive padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
 * - Configurable max-width constraints based on content type
 * - Centered content with automatic horizontal margins
 */
export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'full'
}: ResponsiveContainerProps) {
  // Map maxWidth prop to Tailwind classes
  const maxWidthClasses = {
    sm: 'max-w-2xl',    // 672px - for narrow content like forms
    md: 'max-w-4xl',    // 896px - for standard content
    lg: 'max-w-6xl',    // 1152px - for wide content
    xl: 'max-w-7xl',    // 1280px - for very wide content
    full: 'max-w-full'  // No constraint - full width
  };

  return (
    <div
      className={`
        px-4 md:px-6 lg:px-8
        ${maxWidthClasses[maxWidth]}
        mx-auto
        w-full
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}
