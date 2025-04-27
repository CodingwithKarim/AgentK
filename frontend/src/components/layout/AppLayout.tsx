import React from "react"
import { Header } from "./Header"

type AppLayoutProps = {
    children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({children}) => {
    return (
        <div className="bg-gradient-to-br from-gray-200 via-white to-gray-100 flex items-start justify-center py-1 min-h-screen font-[Poppins]">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 overflow-visible">
          <Header />
          <div className="px-8 pb-8 space-y-6">{children}</div>
        </div>
      </div>
    )
}