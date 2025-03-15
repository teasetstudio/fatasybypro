import React, { ElementType, ReactNode } from "react";
import clsx from "clsx";

// Define different size classes
const textSizes = {
  sm: "text-sm sm:text-base",
  base: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
  xl: "text-xl sm:text-2xl",
  "2xl": "text-2xl sm:text-3xl",
  "3xl": "text-3xl sm:text-4xl",
  "4xl": "text-4xl sm:text-5xl",
};

type TextProps = {
  as?: ElementType;
  size?: keyof typeof textSizes; // Size now directly controls text size
  className?: string;
  children: ReactNode;
};

const Text: React.FC<TextProps> = ({ as: Tag = "p", size = "base", className = "", children, ...props }) => {
  return (
    <Tag className={clsx(textSizes[size], className)} {...props}>
      {children}
    </Tag>
  );
};

export default Text;
