import * as React from 'react'
import { cn } from './utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'accent'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-stone-900 text-stone-50 hover:bg-stone-900/80',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-100/80',
    destructive: 'bg-red-500/10 text-red-700 border border-red-200',
    outline: 'text-stone-950 border border-stone-200',
    success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-500/10 text-amber-700 border border-amber-200',
    accent: 'bg-amber-500/10 text-amber-800 border border-amber-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
