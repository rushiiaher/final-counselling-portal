import React from "react";

export default function PageContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`w-full mx-auto max-w-7xl px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
