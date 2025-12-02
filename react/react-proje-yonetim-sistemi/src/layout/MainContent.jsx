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
import StartPage from '../components/StartPage'
import Profile from '../components/Profile'
import AccountSettings from '../components/AccountSettings'
import ChangeEmailAdress from '../components/ChangeEmailAdress'
import ChangeEmailAdressResponsePage from '../pages/ChangeEmailResponsePage'
import ChangePassword from '../components/ChangePassword'
import ChangePhonePage from '../components/ChangePhonePage'

function MainContent({ drawerOpen, toggleDrawer }) {

  return (

    <Routes>
      <Route path="/" element={<MainPage drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />}>
        <Route index element={<StartPage />} />  
        <Route path="profile" element={<Profile />} />
        <Route path="account-settings" element={<AccountSettings />} />
        <Route path="change-email-adress" element={<ChangeEmailAdress />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="change-phone" element={<ChangePhonePage />} />         
      </Route>
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-approved" element={<RegisterApproved />} />
      <Route path="/resend-mail-verification" element={<ResendEmailVerification />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password-mail" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordResponsePage />} />
      <Route path="/change-email" element={<ChangeEmailAdressResponsePage />} />

    </Routes>

  )
}

export default MainContent