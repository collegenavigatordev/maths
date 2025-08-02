import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChapterView from './components/ChapterView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter/:id" element={<ChapterView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;