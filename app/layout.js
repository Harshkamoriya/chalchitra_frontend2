import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import the CSS
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/providers/sessionProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "ResQ-connect",
  description: "Roadside Assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={outfit.className}>
        <Providers>
          <AppContextProvider>
          <Navbar />
          {children}
          <Footer />
          </AppContextProvider>

          {/* 🔥 Place ToastContainer once, near bottom of body */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Providers>
      </body>
    </html>
  );
}
