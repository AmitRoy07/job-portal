import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs transition-[border-color,box-shadow,color] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-[#1666d7]/40 focus-visible:ring-4 focus-visible:ring-[#1666d7]/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
