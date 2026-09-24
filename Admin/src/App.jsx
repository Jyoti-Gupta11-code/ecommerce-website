import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// backend URL from environment variables with production fallback
const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'https://ecommerce-website-nvw6.onrender.com';
export const backendUrl = rawBackendUrl.replace(/\/+$/, '');
export const currency = '₹'

const App = () => {
  const [token, setToken] = useState('')

  // ✅ keep user logged in after refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />

      {token === ""
        ? <Login setToken={setToken} />
        : <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/list' element={<List token={token} />} />
                  <Route path='/orders' element={<Orders token={token} />} />
                </Routes>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App;