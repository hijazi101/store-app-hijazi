import "@/styles/globals.css";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { SessionProvider } from "next-auth/react"
function app({ Component,  
  pageProps: { session, ...pageProps } }) {
  return (
    <div>
       <SessionProvider session={session}>
 
  <Component {...pageProps} />
  
  </SessionProvider>
  </div>
  )
}

export default app