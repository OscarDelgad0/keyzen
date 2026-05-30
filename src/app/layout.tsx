import type { Metadata } from "next";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { brand } from "@/theme/brand";

export const metadata: Metadata = {
  title: brand.name,
  description: "Sistema administrativo y punto de venta para cerrajería.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
