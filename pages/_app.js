import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useEffect } from "react";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  body{
    background-color: #eee;+
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps }, }) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          {
            Component.auth ?
              <Auth adminOnly={Component.auth} >
                <Component {...pageProps} />
              </Auth>
              :
              <Component {...pageProps} />
          }
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}


function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=loging required");
    },
  });

  useEffect(() => {
    console.log(adminOnly, "adminOnly");
    if (status === "loading") {
      return; // Don't proceed further if still loading
    }
    if (adminOnly && !session.user.isAdmin) {
      console.error("Unauthorized access. Admin login required.");
      router.push("/unauthorized?message=admin login required");
    }
  }, [status, session, adminOnly, router]);
  return children;
}

