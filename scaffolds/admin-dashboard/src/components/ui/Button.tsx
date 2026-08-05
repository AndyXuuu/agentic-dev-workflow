import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'danger' | 'dangerOutline' | 'ghost' | 'link' | 'neutral' | 'outline' | 'primary'
type ButtonSize = 'default' | 'small'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  size?: ButtonSize
  square?: boolean
  startIcon?: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  danger: 'btn-error',
  dangerOutline: 'btn-error btn-outline',
  ghost: 'btn-ghost',
  link: 'link link-hover h-auto min-h-0 p-0',
  neutral: '',
  outline: 'btn-outline',
  primary: 'btn-primary',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  className,
  disabled,
  loading = false,
  size = 'default',
  square = false,
  startIcon,
  type = 'button',
  variant = 'neutral',
  ...props
}, ref) {
  const classes = [
    'btn',
    variantClasses[variant],
    size === 'small' ? 'btn-sm' : '',
    square ? 'btn-square' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={classes}
      disabled={disabled || loading}
      ref={ref}
      type={type}
    >
      {loading ? <span aria-hidden className="loading loading-spinner loading-sm" /> : startIcon}
      {children}
    </button>
  )
})
