import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  title: "SaaS Analytics Dashboard",
  description: "Frontend Capstone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}