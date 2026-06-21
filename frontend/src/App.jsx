import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Docs from './pages/public/Docs';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Unauthorized from './pages/auth/Unauthorized';
import OAuthCallback from './pages/auth/OAuthCallback';

// App Pages
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import GlobalSearch from './pages/GlobalSearch';

// CRM Pages
import CustomersList from './pages/crm/CustomersList';
import CustomerProfile from './pages/crm/CustomerProfile';
import LeadsList from './pages/crm/LeadsList';
import CompaniesList from './pages/crm/CompaniesList';

// Ticket Pages
import TicketsList from './pages/tickets/TicketsList';
import NewTicket from './pages/tickets/NewTicket';
import TicketDetail from './pages/tickets/TicketDetail';
import TicketsBoard from './pages/tickets/TicketsBoard';

// Team Pages
import TeamList from './pages/team/TeamList';
import InviteUser from './pages/team/InviteUser';
import UserProfile from './pages/team/UserProfile';
import Roles from './pages/team/Roles';

// Analytics & Reports
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

// Billing
import BillingOverview from './pages/billing/BillingOverview';
import BillingHistory from './pages/billing/BillingHistory';

// Settings
import SettingsLayout from './pages/settings/SettingsLayout';
import GeneralSettings from './pages/settings/GeneralSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import TeamSettings from './pages/settings/TeamSettings';
import IntegrationsSettings from './pages/settings/IntegrationsSettings';
import WebhooksSettings from './pages/settings/WebhooksSettings';

// Notifications
import Notifications from './pages/Notifications';

// Profile
import Profile from './pages/Profile';

// Errors
import NotFound from './pages/errors/NotFound';
import ServerError from './pages/errors/ServerError';

// Admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTenants from './pages/admin/AdminTenants';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBilling from './pages/admin/AdminBilling';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/docs" element={<Docs />} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Route>

        {/* Authenticated Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* CRM */}
            <Route path="crm" element={<Navigate to="/app/crm/customers" replace />} />
            <Route path="crm/customers" element={<CustomersList />} />
            <Route path="crm/customers/:id" element={<CustomerProfile />} />
            <Route path="crm/leads" element={<LeadsList />} />
            <Route path="crm/companies" element={<CompaniesList />} />

            {/* Tickets */}
            <Route path="tickets" element={<TicketsList />} />
            <Route path="tickets/new" element={<NewTicket />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="tickets/board" element={<TicketsBoard />} />

            {/* Team */}
            <Route path="team" element={<TeamList />} />
            <Route path="team/invite" element={<InviteUser />} />
            <Route path="team/:id" element={<UserProfile />} />
            <Route path="roles" element={<Roles />} />

            {/* Analytics & Reports */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />

            {/* User & Global */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="search" element={<GlobalSearch />} />
            <Route path="profile" element={<Profile />} />

            {/* Billing */}
            <Route path="billing" element={<BillingOverview />} />
            <Route path="billing/history" element={<BillingHistory />} />

            {/* Settings */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="team" element={<TeamSettings />} />
              <Route path="integrations" element={<IntegrationsSettings />} />
              <Route path="webhooks" element={<WebhooksSettings />} />
            </Route>
          </Route>

          {/* System Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tenants" element={<AdminTenants />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Route>

        {/* Errors & Catch-all */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
