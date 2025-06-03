// App.tsx
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import FeatureDetailsPage from './pages/FeatureDetailsPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/feature-details" element={<FeatureDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
