type SkeletonProps = {
  className?: string
  variant?: 'avatar' | 'block' | 'control' | 'text'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return <span aria-hidden className={['skeleton app-skeleton', `app-skeleton--${variant}`, className].filter(Boolean).join(' ')} />
}
