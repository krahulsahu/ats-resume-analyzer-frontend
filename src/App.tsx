import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import type { AtsReportDTO, ResumeDTO, JobDTO } from './types';
import './index.css';

function App() {
  const [report, setReport] = useState<AtsReportDTO | null>(null);
  const [resume, setResume] = useState<ResumeDTO | null>(null);
  const [job, setJob] = useState<JobDTO | null>(null);

  const handleAnalysisComplete = (newReport: AtsReportDTO, newResume: ResumeDTO, newJob: JobDTO) => {
    setReport(newReport);
    setResume(newResume);
    setJob(newJob);
  };

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<UploadPage onAnalysisComplete={handleAnalysisComplete} />} />
          <Route path="/results" element={<ResultsPage report={report} resume={resume} job={job} />} />
          <Route path="/dashboard" element={<DashboardPage report={report} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
