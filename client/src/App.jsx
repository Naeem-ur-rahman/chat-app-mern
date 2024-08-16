import React, { Children } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';

const ChatRoute = ({ childern }) => {
  const { userInfo } = useAppStore();
  const isAutenticated = !!userInfo;
  return isAutenticated ? <Chat /> : <Navigate to='/auth' />;
}

const ProfileRoute = ({ childern }) => {
  const { userInfo } = useAppStore();
  const isAutenticated = !!userInfo;
  return isAutenticated ? <Profile /> : <Navigate to='/auth' />;
}

const AuthRoute = ({ childern }) => {
  const { userInfo } = useAppStore();
  const isAutenticated = !!userInfo;
  return isAutenticated ? <Navigate to='/chat' /> : <Auth />;
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoute />
        } />
        < Route path='/chat' element={
          <ChatRoute />
        } />
        < Route path='/profile' element={
          <ProfileRoute />
        } />
        < Route path='*' element={< Navigate to="/auth" />} />
      </Routes >
    </BrowserRouter >
  );
}

export default App;
