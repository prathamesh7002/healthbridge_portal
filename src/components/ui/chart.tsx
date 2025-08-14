"use client"

import * as React from "react"
import dynamic from 'next/dynamic'
import { cn } from "@/lib/utils"

// Simple chart configuration type
type ChartConfig = {
  [key: string]: {
    label?: string
    color?: string
  }
}

// Dynamic imports with proper typing
interface ResponsiveContainerProps {
  width?: string | number
  height?: string | number
  children: React.ReactNode
}

const ResponsiveContainer = dynamic<ResponsiveContainerProps>(
  () => import('recharts').then((mod) => mod.ResponsiveContainer) as any,
  { ssr: false }
)

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip) as any,
  { ssr: false }
)

const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend) as any,
  { ssr: false }
)

// Simple chart container component
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  width?: string | number
  height?: string | number
}

export const ChartContainer = ({
  children,
  className,
  width = '100%',
  height = 300,
  ...props
}: ChartContainerProps) => {
  return (
    <div className={cn("w-full h-[300px] flex items-center justify-center", className)} {...props}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

// Simple tooltip component
export const ChartTooltip = ({
  active,
  payload,
  label,
  className,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: string | number
    payload: any
    color: string
    dataKey: string | number
  }>
  label?: string
  className?: string
}) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className={cn("bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg", className)}>
      <p className="font-medium">{label}</p>
      <div className="space-y-1 mt-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple legend component
export const ChartLegend = ({
  payload,
  className,
}: {
  payload?: Array<{
    value: string
    color: string
  }>
  className?: string
}) => {
  if (!payload || !payload.length) return null

  return (
    <div className={cn("flex flex-wrap justify-center gap-4 mt-4", className)}>
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Export all chart components
export {
  ResponsiveContainer,
  Tooltip,
  Legend,
}
