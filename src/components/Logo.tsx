import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'colored';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'colored',
  className = '',
  showTagline = false,
}) => {
  // Height configurations corresponding to standard nav and hero ratios
  const heightClass =
    size === 'sm' ? 'h-12 sm:h-14' : size === 'lg' ? 'h-16 sm:h-20 md:h-20' : 'h-14 sm:h-16';

  return (
    <div className={`inline-flex items-center ${className}`}>
      {variant === 'light' ? (
        // For dark backgrounds (such as footer or dark bars), wrap in a clean white badge to preserve brand colors
        <div className="bg-white rounded-xl p-1.5 shadow-sm inline-flex items-center justify-center">
          <img
            src="/assets/sivamwings-logo.png"
            alt="Sivam Wings - Skilled People | Stronger Businesses"
            className={`${heightClass} w-auto object-contain`}
          />
        </div>
      ) : (
        <img
          src="/assets/sivamwings-logo.png"
          alt="Sivam Wings - Skilled People | Stronger Businesses"
          className={`${heightClass} w-auto object-contain drop-shadow-2xs`}
        />
      )}
    </div>
  );
};
