import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { MemeProvider } from './context/MemeContext.jsx'
import { UserProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <MemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </MemeProvider>
    </ThemeProvider>
  </BrowserRouter>
)
