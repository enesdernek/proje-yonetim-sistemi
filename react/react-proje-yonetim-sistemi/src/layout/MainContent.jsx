import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Authenticate from '../pages/Authenticate'
import MainPage from '../components/MainPage'
import Register from '../pages/Register'

function MainContent() {
  return (

    <Routes>
      <Route path="/" element={<MainPage/>}></Route>
      <Route path="/authenticate" element={<Authenticate/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
    </Routes>

  )
}

export default MainContent