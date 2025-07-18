import { Outfit } from "next/font/google";
import "../globals.css";
import { AppContextProvider } from "../(nav2)/context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import the CSS
import Footer from "@/components/Footer";
import { Providers } from "@/providers/sessionProvider";
import { UserProvider } from "../(nav2)/context/UserContext";
import { AuthProvider } from "../(nav2)/context/AuthContext";
import TopNavbar from "@/components/topnavbar";


const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "ChalChitra",
  description: "It is a video editing marketplace",
   icons: {
    icon: "/favicon.ico", // or .png or .svg
  },
};

export default function TestLayout({ children }) {
  return (
  
     
        <Providers>
          <AppContextProvider>
            <UserProvider>   
              <AuthProvider>     
               <TopNavbar/>
               
          {children}
          <Footer />
           </AuthProvider>
          </UserProvider>

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
     
  );
}
