import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import BrandingQuiz from './pages/BrandingQuiz';
import MarketingQuiz from './pages/MarketingQuiz';
import VendasQuiz from './pages/VendasQuiz';
import Results from './pages/Results';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/quiz/branding" element={<BrandingQuiz />} />
          <Route path="/quiz/marketing" element={<MarketingQuiz />} />
          <Route path="/quiz/vendas" element={<VendasQuiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Layout>
    </Router>
  );
}
