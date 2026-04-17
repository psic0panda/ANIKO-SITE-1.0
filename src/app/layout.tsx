import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/analytics/FacebookPixel";
import { Clarity } from "@/components/analytics/Clarity";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SensoryProvider } from "@/context/SensoryContext";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aniko - Animações Adaptativas para Crianças com TEA",
  description: "Sistema de animações personalizadas que se adaptam ao perfil de cada criança autista.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${baloo.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <SensoryProvider>
          <Suspense fallback={null}>
            <FacebookPixel />
          </Suspense>
          <Clarity />
          {children}
          <Analytics />
          <SpeedInsights />
        </SensoryProvider>
      </body>
    </html>
  );
}
