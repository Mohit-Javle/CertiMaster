import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout, DashboardLayout } from "./components/layout/Layouts";

// Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { TemplatesGallery } from "./pages/Templates/TemplatesGallery";
import { Editor } from "./pages/Editor/Editor";
import { BulkGenerator } from "./pages/Bulk/BulkGenerator";
import { MyCertificates } from "./pages/Settings/MyCertificates";
import { Settings } from "./pages/Settings/Settings";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><DashboardLayout><TemplatesGallery /></DashboardLayout></ProtectedRoute>} />
        <Route path="/editor/:templateId" element={<ProtectedRoute><DashboardLayout><Editor /></DashboardLayout></ProtectedRoute>} />
        <Route path="/bulk" element={<ProtectedRoute><DashboardLayout><BulkGenerator /></DashboardLayout></ProtectedRoute>} />
        <Route path="/my-certificates" element={<ProtectedRoute><DashboardLayout><MyCertificates /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
