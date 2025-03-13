
import React, { memo } from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const Loading = memo(({ 
  size = "md", 
  fullScreen = false 
}: LoadingProps) => {
  // Pre-calculate size classes for faster rendering
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const spinner = (
    <div 
      className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
      aria-label="Loading"
      role="status"
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
});

Loading.displayName = "Loading";

// Add an alias for backward compatibility
export const Loader = Loading;
