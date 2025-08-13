import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  animationType?: 'none' | 'pulse' | 'bounce' | 'tada'
}

const buttonAnimations = {
  none: {},
  pulse: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.02, 1],
      transition: { 
        repeat: Infinity, 
        repeatType: 'reverse' as const,
        duration: 1.5 
      } 
    },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 }
  },
  bounce: {
    initial: { y: 0 },
    animate: { 
      y: [0, -3, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2 
      } 
    },
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 }
  },
  tada: {
    initial: { scale: 1, rotate: 0 },
    animate: { 
      scale: [1, 0.9, 0.9, 1.1, 0.9, 1.03, 0.97, 1],
      rotate: [0, -3, -3, -3, 3, -2, 2, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        repeatDelay: 3
      } 
    },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 }
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    children,
    disabled,
    isLoading = false,
    loadingText,
    animationType = 'none',
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button
    const animationProps = buttonAnimations[animationType] || {}
    
    return (
      <Comp
        className={cn(
          'relative overflow-hidden',
          buttonVariants({ variant, size, className }),
          isLoading && 'cursor-wait'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...animationProps}
        {...props}
      >
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </motion.div>
        )}
        <span className={cn(
          'inline-flex items-center justify-center gap-2',
          isLoading && 'invisible'
        )}>
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
