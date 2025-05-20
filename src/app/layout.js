// src/app/layout.js
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <main className="min-h-screen p-4">
          {children}
        </main>
      </body>
    </html>
  );
}