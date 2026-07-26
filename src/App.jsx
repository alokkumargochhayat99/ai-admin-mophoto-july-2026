import { useState } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'
import PWABadge from './PWABadge.jsx'
import './assets/css/bootstrap.min.css';
import './App.css'
import { RouterProvider } from 'react-router-dom'
import Router from './Router.jsx'

function App() {
  

  return (
    <>
      <RouterProvider router={Router}></RouterProvider>
    </>
  )
}

export default App
