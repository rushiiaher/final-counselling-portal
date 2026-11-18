import React from "react";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, description, icon, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center border border-dashed border-line rounded-[16px] bg-surface">
      <div className="text-navy mb-4 bg-tint p-4 rounded-full">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h3 className="font-display text-h3 font-bold text-ink mb-2">{title}</h3>
      <p className="text-[0.9375rem] text-ink-2 max-w-sm mb-6">{description}</p>
      
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="btn btn-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
