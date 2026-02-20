
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardHome from './pages/dashboard/DashboardHome';
import Employees from './pages/dashboard/Employees';
import Vault from './pages/dashboard/Vault';

import Schedule from './pages/dashboard/Schedule';
import Analytics from './pages/dashboard/Analytics';
import Clients from './pages/dashboard/Clients';
import Services from './pages/dashboard/Services';

import Profile from './pages/dashboard/Profile';
import MyBookings from './pages/dashboard/MyBookings';
import Settings from './pages/dashboard/Settings';
import Financials from './pages/dashboard/Financials';
import AEGISAI from './pages/dashboard/AEGISAI';
import UpgradeRequired from './pages/dashboard/UpgradeRequired';

import PublicBooking from './pages/public/PublicBooking';
import PublicReview from './pages/public/PublicReview';

import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrandingProvider } from './contexts/BrandingContext';
import { VaultProvider } from './contexts/VaultContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { AIProvider } from './contexts/AIContext';
import Onboarding from './pages/auth/Onboarding';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <SidebarProvider>
      <AuthProvider>
        <BrandingProvider>
          <VaultProvider>
            <OnboardingProvider>
              <AIProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Toaster position="top-right" />
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />

                    {/* Public Routes (No Auth Required) */}
                    <Route element={<PublicLayout />}>
                      <Route path="/booking/:orgId" element={<PublicBooking />} />
                      <Route path="/review/:orgId/:bookingId" element={<PublicReview />} />
                    </Route>

                    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<DashboardHome />} />
                      <Route path="/upgrade-required" element={<UpgradeRequired />} />

                      {/* Business Only */}
                      <Route path="/vault" element={
                        <ProtectedRoute allowedTiers={['Business']}>
                          <Vault />
                        </ProtectedRoute>
                      } />

                      {/* Solo & Business */}
                      <Route path="/schedule" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Schedule />
                        </ProtectedRoute>
                      } />
                      <Route path="/employees" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Employees />
                        </ProtectedRoute>
                      } />
                      <Route path="/analytics" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Analytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/aegis-ai" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <AEGISAI />
                        </ProtectedRoute>
                      } />
                      <Route path="/clients" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Clients />
                        </ProtectedRoute>
                      } />
                      <Route path="/services" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Services />
                        </ProtectedRoute>
                      } />
                      <Route path="/financials" element={
                        <ProtectedRoute allowedTiers={['Solo', 'Business']}>
                          <Financials />
                        </ProtectedRoute>
                      } />

                      {/* Shared Access (Free, Solo, Business) */}
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/my-bookings" element={<MyBookings />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </AIProvider>
            </OnboardingProvider>
          </VaultProvider>
        </BrandingProvider>
      </AuthProvider>
    </SidebarProvider>
  );
}


export default App;
