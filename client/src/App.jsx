import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AnalyzePage from './pages/AnalyzePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import JobFinderPage from './pages/JobFinderPage.jsx';
import AIToolsPage from './pages/AIToolspage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/jobs" element={<JobFinderPage />} />
        <Route path="/ai-tools" element={<AIToolsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
