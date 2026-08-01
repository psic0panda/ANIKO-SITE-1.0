import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/analytics/FacebookPixel";
import { Clarity } from "@/components/analytics/Clarity";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SensoryProvider } from "@/context/SensoryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import BackgroundDecor from "@/components/BackgroundDecor";

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
  description: "Plataforma de criação de animações personalizadas e roteiros adaptativos para crianças com autismo.",
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
        <ThemeProvider>
          <SensoryProvider>
            <Suspense fallback={null}>
              <FacebookPixel />
            </Suspense>
            <Clarity />
            <BackgroundDecor />
            {children}
            <Analytics />
            <SpeedInsights />
          </SensoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
