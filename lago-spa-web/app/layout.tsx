import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import type { Metadata } from "next";

import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import './globals.css';
import './styles/login.css';
import './styles/principal.css';
import './styles/layout.css'

export const metadata: Metadata = {
  title: "Lago Spa ⋅ Estetica ⋅ Salud",
  description: "Spa, estetica y salud todo lo que tu cuerpo necesita",
  icons: {
    icon: "/favicon.ico", //esta linea no esta haciendo realmente nada, sigo sin entnder donde se esta implementando realmente el favicon, cualquier cosa basta con poner cualquier archivo que quieras llamandolo favicon.ico en la carpeta app
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="d-flex flex-column min-vh-100">
        <AuthProvider>
          <div className="app-wrapper d-flex flex-column min-vh-100">

            <Header />

            <main className="flex-grow-1">
              {children}
            </main>

            <Footer />

          </div>
        </AuthProvider>

        {/* Bootstrap JS – SOLO en cliente */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
