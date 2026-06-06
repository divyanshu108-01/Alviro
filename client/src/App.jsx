import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';

import DesignOverlay from './components/DesignOverlay';
import Chatbot from './components/Chatbot';

import ScrollToTop from './components/ScrollToTop';

export default App;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <DesignOverlay />
        <Chatbot />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
