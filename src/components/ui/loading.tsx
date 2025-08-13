import { Loader2 } from "lucide-react"

type LoadingProps = {
  text?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export function Loading({ 
  text = 'Loading...', 
  className = '',
  size = 'default'
}: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    icon: 'h-4 w-4'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loading size="lg" className="text-xl" />
    </div>
  )
}
