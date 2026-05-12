import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import DashboardPage from './dashboard/DashboardPage';
import WorkspacePage from './editor/WorkspacePage';
import PublicPortfolioPage from './portfolio/PublicPortfolioPage';
import TemplatesPage from './templates/TemplatesPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
        
        <Route path="/workspace/:id" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
        
        <Route path="/p/:slug" element={<PublicPortfolioPage />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}