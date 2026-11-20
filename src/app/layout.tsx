import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "NJIRA — A path for creative work", template: "%s — NJIRA" },
  description: "A Malawi-first creative ecosystem connecting talent, clients, tools and opportunity."
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#102326" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
