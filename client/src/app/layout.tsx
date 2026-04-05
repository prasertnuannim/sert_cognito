import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageSwitcher } from "@/i18n/components/language-switcher";
import { I18nProvider } from "@/i18n/i18n-provider";
import { getServerLocale, getServerTranslator } from "@/i18n/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLocale={locale}>
          <div className="fixed right-4 top-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
