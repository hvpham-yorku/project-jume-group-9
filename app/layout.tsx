import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
