import {Routes, Route, useLocation } from 'react-router-dom';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';
import Connect from './Pages/Connect.jsx';
import UserPreference from './Pages/UserPreference.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import './App.css';
import Recommendation from './Components/Recommendation.jsx';
import HotelPage from './Pages/HotelPage.jsx';
import RestaurantPage from './Pages/RestaurantPage.jsx';
import ThingsToDoPage from './Pages/ThingsToDoPage.jsx';
import TrackedFlights from './Pages/TrackedFlights.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/Footer.jsx';

export default function App() {
  const location = useLocation();
  const hideFooter = ['/auth/login', '/auth/register'].includes(location.pathname);

  return (
    <div>
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
        <Route
          path='/hotels'
          element={
            <ProtectedRoute >
              <HotelPage/>
            </ProtectedRoute>
            }
        />
        <Route
          path='/restaurants'
          element={
            <ProtectedRoute >
              <RestaurantPage/>
            </ProtectedRoute>
            }
        />
        <Route
          path='/things-to-do'
          element={
            <ProtectedRoute >
              <ThingsToDoPage/>
            </ProtectedRoute>
            }
        />
        <Route
          path='/tracked-flights'
          element={
            <ProtectedRoute >
              <TrackedFlights/>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme='light'
      />
      {!hideFooter && <Footer />}
    </div>
  );
}
