import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from '../Layout/Layout'
import '../styles/styles.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from '../context'
import { useEffect } from 'react'


function MyApp({ Component, pageProps }) {
  // Place this in the pages/_app.js file
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <Provider>
      <Layout>
        <ToastContainer position='top-center' />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
