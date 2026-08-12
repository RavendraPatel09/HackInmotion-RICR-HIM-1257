import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !counterRef.current) {
      if (counterRef.current) {
        counterRef.current.innerText = `${prefix}${value}${suffix}`;
      }
      return;
    }

    const obj = { count: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        count: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = `${prefix}${Math.round(obj.count)}${suffix}`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [value, duration, prefix, suffix]);

  return <span ref={counterRef} className={className}>{prefix}{value}{suffix}</span>;
};
