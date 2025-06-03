import { Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/HomePage.tsx';
import UploadPage from '../pages/UploadPage.tsx';
import ResultPages from '../pages/ResultPage.tsx';
import FeatureDetailsPage from '../pages/FeatureDetailsPage.tsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/result" element={<ResultPages />} />
      <Route path="/feature-details" element={<FeatureDetailsPage />} />
    </Routes>
  );
}
