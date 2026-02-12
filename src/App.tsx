
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Overview from './pages/dashboard/Overview';
import Employees from './pages/dashboard/Employees';
import Vault from './pages/dashboard/Vault';
import PlaceholderPage from './components/PlaceholderPage';

import { SidebarProvider } from './contexts/SidebarContext';

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/schedule" element={<PlaceholderPage title="Schedule" />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="/clients" element={<PlaceholderPage title="Clients" />} />
            <Route path="/services" element={<PlaceholderPage title="Services & Products" />} />
            <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
