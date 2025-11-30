import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Authenticate from '../pages/Authenticate'
import MainPage from '../components/MainPage'
import Register from '../pages/Register'
import RegisterApproved from '../pages/RegisterApproved'
import ResendEmailVerification from '../pages/ResendEmailVerification'
import VerifyEmailPage from '../pages/VerifyEmailPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import ResetPasswordResponsePage from '../pages/ResetPasswordResponsePage'

function MainContent() {
  return (

    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-approved" element={<RegisterApproved />} />
      <Route path="/resend-mail-verification" element={<ResendEmailVerification />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password-mail" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordResponsePage />} />

    </Routes>

  )
}

export default MainContent