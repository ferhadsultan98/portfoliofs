import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import MainOne from './components/Main/MainOne';
import Layout from './components/Layout/Layout';
import ErrorPage from './components/Error/ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><MainOne /></Layout>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
