import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Auth0ProviderWithNavigate, AuthPage, CallbackPage } from './Auth';
import Navbar from './Navbar';
import LandingPage from './landing_page/LandingPage';
import ImageDescriber from './img_description/ImageDescriber';
import Profile from './profile/Profile';
import Dashboard from './dashboard/Dashboard';
import GetStarted from './GetStarted';
import { ThemeProvider } from './ColorTheme';
import EmergencyMap from './MapTestDaniel';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/', '/auth', '/callback'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/describe" element={<ImageDescriber />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapTest" element={<EmergencyMap />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Auth0ProviderWithNavigate>
    </Router>
  );
};

export default App;

// import Map from "./Map";

// function App() {
//   return <Map />;
// }

// export default App;