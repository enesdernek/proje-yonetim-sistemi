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
import SearchUserPage from '../components/SearchUserPage'
import UsersProfile from '../components/UsersProfile'
import ConnectionRequestPage from '../components/ConnectionRequestPage'
import Connections from '../components/Connections'
import ProjectList from '../components/ProjectList'
import TaskList from '../components/TaskList'
import Project from '../components/Project'
import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'
import NotAuthenticated from '../components/NotAuthenticated'
import ProjectAddMember from '../components/ProjectAddMember'
import ProjectUpdate from '../components/ProjectUpdate'
import ProjectManagement from '../components/ProjectManagement'
import ProjectCreate from '../components/ProjectCreate'
import ProjectSettings from '../components/ProjectSettings'


function MainContent({ drawerOpen, toggleDrawer }) {

  return (

    <Routes>
      {/* Giriş gerektiren tüm sayfalar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
          </ProtectedRoute>
        }
      >
        <Route index element={<StartPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="account-settings" element={<AccountSettings />} />
        <Route path="change-email-adress" element={<ChangeEmailAdress />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="change-phone" element={<ChangePhonePage />} />
        <Route path="search-user" element={<SearchUserPage />} />
        <Route path="users-profile/:userId" element={<UsersProfile />} />
        <Route path="connection-requests" element={<ConnectionRequestPage />} />
        <Route path="connections" element={<Connections />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/:projectId" element={<Project />} />
        <Route path="projects/:projectId/add-member" element={<ProjectAddMember />} />
        <Route path="projects/:projectId/update-project" element={<ProjectUpdate />} />
        <Route path="projects/:projectId/manage-project" element={<ProjectManagement />} />
        <Route path="projects/:projectId/project-settings" element={<ProjectSettings />} />
        <Route path="projects/create-project" element={<ProjectCreate />} />
        <Route path="tasks" element={<TaskList />} />
      </Route>

      {/* Giriş gerektirmeyen sayfalar */}
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-approved" element={<RegisterApproved />} />
      <Route path="/resend-mail-verification" element={<ResendEmailVerification />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password-mail" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordResponsePage />} />
      <Route path="/change-email" element={<ChangeEmailAdressResponsePage />} />

      {/* Not Authenticated Page */}
      <Route path="/not-authenticated" element={<NotAuthenticated />} />
    </Routes>

  )
}

export default MainContent