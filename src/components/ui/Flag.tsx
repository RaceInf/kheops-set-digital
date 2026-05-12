import React from 'react';

interface FlagProps {
  countryCode: string;
  className?: string;
}

const Flag: React.FC<FlagProps> = ({ countryCode, className }) => {
  if (!countryCode) return null;

  const flag = countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  return <span className={className}>{flag}</span>;
};

export default Flag;
