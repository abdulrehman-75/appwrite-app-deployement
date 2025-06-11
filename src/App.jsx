import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentAccount()
    .then((userData) => {
      if (userData) {
        // Fixed: Pass userData directly, not wrapped in object
        dispatch(login(userData))
      } else {
        dispatch(logout())
      }
    })
    .catch((error) => {
      // Added error handling
      console.log("App :: useEffect :: getCurrentUser :: error", error)
      dispatch(logout())
    })
    .finally(() => setLoading(false))
  }, [dispatch]) // Added dispatch to dependency array

  // Show loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-400'>
        <div className='text-center'>
          <div className='mb-4 text-2xl font-bold text-white'>Loading...</div>
          <div className='w-12 h-12 mx-auto border-b-2 border-white rounded-full animate-spin'></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className='flex flex-wrap content-between min-h-screen bg-gray-400'>
      <div className='block w-full'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App