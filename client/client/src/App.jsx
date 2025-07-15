import {Routes, Route } from 'react-router-dom';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';
import Connect from './Pages/Connect.jsx';
import UserPreference from './Pages/UserPreference.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import './App.css';
import Recommendation from './Components/Recommendation.jsx';

export default function App() {
  return (

    <Routes>
      <Route path='/auth/login' element={<Login />} />
      <Route path='/auth/register' element={<Register />} />

      <Route
        path='/'
        element={
          <ProtectedRoute >
            <Home/>
          </ProtectedRoute>
          }
      />

      <Route
        path='/auth/connect'
        element={
          <ProtectedRoute >
            <Connect/>
          </ProtectedRoute>
          }
      />

      <Route
        path='/preference'
        element={
          <ProtectedRoute >
            <UserPreference/>
          </ProtectedRoute>
        }
      />

      <Route
        path='/auth/recommendations'
        element={
          <ProtectedRoute >
            <Recommendation/>
          </ProtectedRoute>
          }
      />
    </Routes>
  );
}
