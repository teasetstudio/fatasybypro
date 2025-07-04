import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Theme, Placement } from './types';

export interface Props {
  content: string | ReactNode;
  children: ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click';
  animation?: boolean;
  theme?: Theme;
  arrow?: boolean;
  className?: string;
  contentClassName?: string;
  delay?: number;
  offset?: number;
}

const Tooltip: React.FC<Props> = ({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  animation = true,
  theme = 'dark',
  arrow = true,
  className = '',
  contentClassName = '',
  delay = 0,
  offset = 8
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showDelay, setShowDelay] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      if (delay > 0) {
        const timer = setTimeout(() => setIsVisible(true), delay);
        setShowDelay(timer);
      } else {
        setIsVisible(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (showDelay) {
        clearTimeout(showDelay);
        setShowDelay(null);
      }
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const getPlacementStyles = () => {
      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - offset;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'top-start':
          top = triggerRect.top - tooltipRect.height - offset;
          left = triggerRect.left;
          break;
        case 'top-end':
          top = triggerRect.top - tooltipRect.height - offset;
          left = triggerRect.right - tooltipRect.width;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + offset;
          break;
        case 'right-start':
          top = triggerRect.top;
          left = triggerRect.right + offset;
          break;
        case 'right-end':
          top = triggerRect.bottom - tooltipRect.height;
          left = triggerRect.right + offset;
          break;
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom-start':
          top = triggerRect.bottom + offset;
          left = triggerRect.left;
          break;
        case 'bottom-end':
          top = triggerRect.bottom + offset;
          left = triggerRect.right - tooltipRect.width;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - offset;
          break;
        case 'left-start':
          top = triggerRect.top;
          left = triggerRect.left - tooltipRect.width - offset;
          break;
        case 'left-end':
          top = triggerRect.bottom - tooltipRect.height;
          left = triggerRect.left - tooltipRect.width - offset;
          break;
      }
    };

    getPlacementStyles();

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 8;
    if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
    if (top < 0) top = 8;
    if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 8;

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible, placement]);

  useEffect(() => {
    // Close tooltip when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && 
          triggerRef.current && 
          !triggerRef.current.contains(event.target as Node) &&
          tooltipRef.current && 
          !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, trigger]);

  const getTooltipStyles = () => {
    const baseStyles = "fixed z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-sm";
    
    const themeStyles = {
      dark: "text-white bg-gray-900",
      light: "text-gray-900 bg-white border border-gray-200",
      scifi: "text-cyan-400 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 shadow-lg shadow-cyan-500/20",
      auto: "text-white bg-gray-900 dark:bg-gray-700"
    };

    const animationStyles = animation 
      ? "transition-opacity duration-300 ease-in-out" 
      : "";

    const visibilityStyles = isVisible 
      ? "opacity-100" 
      : "opacity-0 pointer-events-none";

    return clsx(
      baseStyles,
      themeStyles[theme],
      animationStyles,
      visibilityStyles,
      contentClassName
    );
  };

  const getArrowStyles = () => {
    const baseStyles = "absolute w-2 h-2 bg-inherit transform rotate-45";
    
    const arrowStyles = {
      'top': "top-full left-1/2 -translate-x-1/2 -translate-y-1",
      'top-start': "top-full left-4 -translate-y-1",
      'top-end': "top-full right-4 -translate-y-1",
      'right': "right-full top-1/2 -translate-y-1/2 translate-x-1",
      'right-start': "right-full top-4 translate-x-1",
      'right-end': "right-full bottom-4 translate-x-1",
      'bottom': "bottom-full left-1/2 -translate-x-1/2 translate-y-1",
      'bottom-start': "bottom-full left-4 translate-y-1",
      'bottom-end': "bottom-full right-4 translate-y-1",
      'left': "left-full top-1/2 -translate-y-1/2 -translate-x-1",
      'left-start': "left-full top-4 -translate-x-1",
      'left-end': "left-full bottom-4 -translate-x-1"
    };

    return clsx(baseStyles, arrowStyles[placement]);
  };

  const getBorderArrowStyles = () => {
    if (theme !== 'light') return '';
    
    const baseStyles = "absolute w-2 h-2 bg-white border border-gray-200 transform rotate-45";
    
    const arrowStyles = {
      'top': "top-full left-1/2 -translate-x-1/2 -translate-y-1 border-t-0 border-l-0",
      'top-start': "top-full left-4 -translate-y-1 border-t-0 border-l-0",
      'top-end': "top-full right-4 -translate-y-1 border-t-0 border-r-0",
      'right': "right-full top-1/2 -translate-y-1/2 translate-x-1 border-r-0 border-t-0",
      'right-start': "right-full top-4 translate-x-1 border-r-0 border-t-0",
      'right-end': "right-full bottom-4 translate-x-1 border-r-0 border-b-0",
      'bottom': "bottom-full left-1/2 -translate-x-1/2 translate-y-1 border-b-0 border-l-0",
      'bottom-start': "bottom-full left-4 translate-y-1 border-b-0 border-l-0",
      'bottom-end': "bottom-full right-4 translate-y-1 border-b-0 border-r-0",
      'left': "left-full top-1/2 -translate-y-1/2 -translate-x-1 border-l-0 border-t-0",
      'left-start': "left-full top-4 -translate-x-1 border-l-0 border-t-0",
      'left-end': "left-full bottom-4 -translate-x-1 border-l-0 border-b-0"
    };

    return clsx(baseStyles, arrowStyles[placement]);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx("inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          className={getTooltipStyles()}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
          role="tooltip"
        >
          {content}
          {arrow && (
            <>
              <div className={getArrowStyles()} />
              {theme === 'light' && <div className={getBorderArrowStyles()} />}
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
