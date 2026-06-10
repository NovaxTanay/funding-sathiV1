// pages/_app.jsx — Next.js app wrapper
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
