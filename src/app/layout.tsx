import '@/styles/globals.css';
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import Navbar from "@/components/navbar/Navbar";
import {Toaster} from "@/components/ui/Toaster";
import React from "react";
import Providers from "@/components/contexts/Providers";
import {SocketProvider} from "@/components/contexts/socket-provider";

export const metadata = {
    title: "TiddeR",
    description: "Everything you need",
}

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                       children,
                                       authModal
                                   }: {
    children: React.ReactNode,
    authModal: React.ReactNode,
}) {
    return (
        <html lang='en' className={cn(
            "bg-white text-slate-900 antialiased light",
            inter.className
        )}
        >
        <body className="min-h-screen pt-12 bg-slate-50
                antialiased"
        >
        <SocketProvider>
            <Providers>

                {/*NAVBAR*/}
                {/* @ts-expect-error server component */}
                <Navbar/>

                {authModal}
                    <div className="container max-w-7xl mx-auto
                                h-full pt-12"
                    >
                        {children}
                    </div>
                <Toaster/>
            </Providers>
        </SocketProvider>
        </body>
        </html>
    )
}
