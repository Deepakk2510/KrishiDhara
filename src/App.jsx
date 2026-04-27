import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import Markets from './pages/Markets';
import DiseaseScanner from './pages/DiseaseScanner';
import Subsidies from './pages/Subsidies';
import Consultation from './pages/Consultation';
import Advisory from './pages/Advisory';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // or a loading spinner
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="markets" element={<Markets />} />
            <Route path="disease-scanner" element={<DiseaseScanner />} />
            <Route path="subsidies" element={<Subsidies />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="advisory" element={<Advisory />} />
            <Route path="shop" element={<Shop />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
