"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#191F28] group-[.toaster]:border-[#E5E8EB] group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-3.5 group-[.toaster]:font-sans group-[.toaster]:text-sm group-[.toaster]:font-semibold",
          description: "group-[.toast]:text-[#6B7684] group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-[#3182F6] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-[#F2F4F6] group-[.toast]:text-[#4E5968] group-[.toast]:rounded-xl group-[.toast]:font-bold",
        },
      }}
      position="top-center"
      richColors
      closeButton
      {...props}
    />
  )
}
