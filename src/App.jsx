import React from 'react'
import PublicRoutes from './routes/PublicRoutes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const App = () => {
  return (
    <>
      <ToastContainer position="top-right" />

      <PublicRoutes />
    </>
  )
}

export default App;