import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.tsx';
import LoginPage from '../features/auth/pages/LoginPage.tsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}