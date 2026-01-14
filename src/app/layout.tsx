import type { Metadata } from 'next';
import './globals.css';
<<<<<<< HEAD
=======
import { ThemeProvider } from '@/app/context/theme-context';
import { Toaster } from '@/components/ui/toaster';
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf

export const metadata: Metadata = {
  title: 'AI Code Assistant',
  description: 'AI code assistant Chrome Extension landing page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body>{children}</body>
=======
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
    </html>
  );
}