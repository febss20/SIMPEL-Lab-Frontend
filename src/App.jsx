import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import './App.css';
import './utils/animations.css';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DebugPage from './pages/DebugPage';
import HomePage from './pages/HomePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Reports from './pages/admin/Reports';
import UsersManagement from './pages/admin/UsersManagement';
import LabManagement from './pages/admin/LabManagement';
import EquipmentManagement from './pages/admin/EquipmentManagement';
import LoansManagement from './pages/admin/LoansManagement';
import AdminProfile from './pages/admin/AdminProfile';
import EquipmentBrowse from './pages/user/EquipmentBrowse';
import EquipmentDetail from './pages/user/EquipmentDetail';
import MyLoans from './pages/user/MyLoans';
import LoanDetail from './pages/user/LoanDetail';
import RequestEquipment from './pages/user/RequestEquipment';
import MaintenanceTasks from './pages/technician/MaintenanceTasks';
import EquipmentOverview from './pages/technician/EquipmentOverview';
import RepairTasks from './pages/technician/RepairTasks';
import SparePartsInventory from './pages/technician/SparePartsInventory';
import ConfirmUnrepairable from './pages/admin/ConfirmUnrepairable';
import MaintenanceTaskDetail from './pages/technician/MaintenanceTaskDetail';
import RepairDetail from './pages/technician/RepairDetail';
import EquipmentDetailTechnician from './pages/technician/EquipmentDetail';

import RoleRoute from './components/common/RoleRoute';


function App() {
  const dispatch = useDispatch();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (localStorage.getItem('token')) {
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setAppInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!appInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/debug" element={<DebugPage />} />
        
        <Route path="/" element={<HomePage />} />
        
        <Route 
          path="/admin" 
          element={
            <RoleRoute roles="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/lab" 
          element={
            <RoleRoute roles="ADMIN">
              <LabManagement />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <RoleRoute roles="ADMIN">
              <UsersManagement />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/equipment" 
          element={
            <RoleRoute roles="ADMIN">
              <EquipmentManagement />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/loans" 
          element={
            <RoleRoute roles="ADMIN">
              <LoansManagement />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <RoleRoute roles="ADMIN">
              <Reports />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/me" 
          element={
            <RoleRoute roles="ADMIN">
              <AdminProfile />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin/confirm-unrepairable" 
          element={
            <RoleRoute roles="ADMIN">
              <ConfirmUnrepairable />
            </RoleRoute>
          } 
        />
        
        <Route 
          path="/technician" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <TechnicianDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/equipment" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <EquipmentOverview />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/maintenance" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <MaintenanceTasks />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/repairs" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <RepairTasks />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/spare-parts" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <SparePartsInventory />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/maintenance/:id" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <MaintenanceTaskDetail />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/repairs/:id" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <RepairDetail />
            </RoleRoute>
          } 
        />
        <Route 
          path="/technician/equipment/:id" 
          element={
            <RoleRoute roles="TECHNICIAN">
              <EquipmentDetailTechnician />
            </RoleRoute>
          } 
        />
        
        <Route 
          path="/user" 
          element={
            <RoleRoute roles="USER">
              <UserDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/user/equipment" 
          element={
            <EquipmentBrowse />
          } 
        />
        <Route 
          path="/user/equipment/:id" 
          element={
            <RoleRoute roles="USER">
              <EquipmentDetail />
            </RoleRoute>
          } 
        />
        <Route 
          path="/user/loans" 
          element={
            <RoleRoute roles="USER">
              <MyLoans />
            </RoleRoute>
          } 
        />
        <Route 
          path="/user/loans/:id" 
          element={
            <RoleRoute roles="USER">
              <LoanDetail />
            </RoleRoute>
          } 
        />
        <Route 
          path="/user/request" 
          element={
            <RoleRoute roles="USER">
              <RequestEquipment />
            </RoleRoute>
          } 
        />
        
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-lg text-gray-600 mb-8">Page not found</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
              >
                Go Back
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App; 