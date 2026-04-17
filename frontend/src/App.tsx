import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import PromptList from './components/PromptList';
import PromptDetail from './components/PromptDetail';
import AddPrompt from './components/AddPrompt';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <Link to="/prompts" className="logo">
              <h1>⚡ PromptLib</h1>
            </Link>
            <nav className="nav-links">
              <NavLink to="/prompts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Explore</NavLink>
              <NavLink to="/add-prompt" className={({ isActive }) => `btn-primary ${isActive ? 'active' : ''}`}>Add Prompt</NavLink>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PromptList />} />
            <Route path="/prompts" element={<PromptList />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/add-prompt" element={<AddPrompt />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
