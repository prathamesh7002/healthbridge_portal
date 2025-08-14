import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type FormErrorProps = {
  message?: string
  className?: string
}

export function FormError({ 
  message, 
  className 
}: FormErrorProps) {
  if (!message) return null

  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
