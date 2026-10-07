import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audit Essai • Groupe Premium",
  description: "Plateforme de gestion et suivi des périodes d'essai du Groupe Premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased font-sans" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary"
        suppressHydrationWarning
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
