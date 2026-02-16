
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Overview from './pages/dashboard/Overview';
import Employees from './pages/dashboard/Employees';
import Vault from './pages/dashboard/Vault';

import Schedule from './pages/dashboard/Schedule';
import Analytics from './pages/dashboard/Analytics';
import Clients from './pages/dashboard/Clients';
import Services from './pages/dashboard/Services';

import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrandingProvider } from './contexts/BrandingContext';
import { VaultProvider } from './contexts/VaultContext';

function App() {
  return (
    <SidebarProvider>
      <AuthProvider>
        <BrandingProvider>
          <VaultProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Overview />} />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </VaultProvider>
        </BrandingProvider>
      </AuthProvider>
    </SidebarProvider>
  );
}


export default App;
