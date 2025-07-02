import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthenticationContextProvider from './Context/AuthenticationContext.jsx'







const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthenticationContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthenticationContextProvider>
  </StrictMode>,
)
