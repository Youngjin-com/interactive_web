import { ReactNode } from 'react';

interface ISection {
  children?: ReactNode;
  bgColor?: string;
  textColor?: string;
  isReverse?: boolean;
}

export const Section = ({ children, bgColor, textColor = '#ffffff', isReverse = false }: ISection) => (
  <div className="section" style={{ backgroundColor: bgColor, color: textColor }}>
    <div className={`content_wrapper ${isReverse ? 'reverse' : ''}`}>{children}</div>
  </div>
);
