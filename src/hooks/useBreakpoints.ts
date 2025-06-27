import { useState, useEffect } from 'react';

// Tailwind CSS breakpoints
const BREAKPOINTS = {
  'xs': 0,      // Extra small (0px and up)
  'sm': 640,    // Small (640px and up)
  'md': 768,    // Medium (768px and up)
  'lg': 1024,   // Large (1024px and up)
  'xl': 1280,   // Extra large (1280px and up)
  '2xl': 1536,  // 2X large (1536px and up)
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

type ReturnType = {
  [key in Breakpoint]: boolean;
};

export const useBreakpoints = (): ReturnType => {
  const [breakpoints, setBreakpoints] = useState<ReturnType>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  });

  useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth;
      setBreakpoints({
        xs: width >= BREAKPOINTS.xs,
        sm: width >= BREAKPOINTS.sm,
        md: width >= BREAKPOINTS.md,
        lg: width >= BREAKPOINTS.lg,
        xl: width >= BREAKPOINTS.xl,
        '2xl': width >= BREAKPOINTS['2xl'],
      });
    };
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  return breakpoints;
};

