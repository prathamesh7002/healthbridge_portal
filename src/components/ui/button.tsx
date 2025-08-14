import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { motion, MotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

// Base button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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

// Animation presets
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
} as const

// Base button props
type BaseButtonProps = {
  isLoading?: boolean
  loadingText?: string
  className?: string
  children: React.ReactNode
}

// Regular button props
type RegularButtonProps = BaseButtonProps & 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'> & {
    asChild?: boolean
    animationType?: never
  }

// Animated button props
type AnimatedButtonProps = BaseButtonProps & 
  Omit<MotionProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'> & {
    asChild?: false
    animationType?: keyof typeof buttonAnimations
  }

type ButtonProps = (RegularButtonProps | AnimatedButtonProps) & 
  VariantProps<typeof buttonVariants>

// Regular button component
const RegularButton = React.forwardRef<HTMLButtonElement, RegularButtonProps & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, asChild = false, children, disabled, isLoading, loadingText, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(
          'relative overflow-hidden',
          buttonVariants({ variant, size, className }),
          isLoading && 'cursor-wait'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2 className="h-5 w-5 animate-spin" />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </div>
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

// Animated button component
const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, children, disabled, isLoading, loadingText, animationType = 'none', ...props }, ref) => {
    const animation = buttonAnimations[animationType] || {}
    
    return (
      <motion.button
        className={cn(
          'relative overflow-hidden',
          buttonVariants({ variant, size, className }),
          isLoading && 'cursor-wait'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        initial={animation.initial}
        animate={animation.animate}
        whileHover={animation.whileHover}
        whileTap={animation.whileTap}
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
      </motion.button>
    )
  }
)

// Main Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    if ('animationType' in props) {
      return <AnimatedButton ref={ref} {...props} />
    }
    return <RegularButton ref={ref} {...props} />
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
