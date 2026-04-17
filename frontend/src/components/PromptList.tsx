import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from '../types';

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/prompts/');
      if (!response.ok) throw new Error('Failed to fetch prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (err) {
      setError('Could not load prompts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getComplexityClass = (complexity: number) => {
    if (complexity <= 3) return 'complexity-low';
    if (complexity <= 7) return 'complexity-medium';
    return 'complexity-high';
  };

  const filteredPrompts = prompts.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = p.title && p.title.toLowerCase().includes(searchLower);
    const contentMatch = p.content && p.content.toLowerCase().includes(searchLower);
    return titleMatch || contentMatch;
  });

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  if (error) return <div className="empty-state"><h3>Oops!</h3><p className="error-message">{error}</p></div>;

  return (
    <div>
      <div className="list-header-row">
        <div>
          <h2 className="page-title">Prompt Library</h2>
          <p className="page-subtitle">Explore a collection of high-quality AI prompts.</p>
        </div>
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {prompts.length === 0 ? (
        <div className="empty-state">
          <h3>No Prompts Found</h3>
          <p>Start by adding your first AI prompt to the library.</p>
          <Link to="/add-prompt" className="btn-primary">Add Prompt</Link>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <h3>No matches found</h3>
          <p>We couldn't find anything matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {filteredPrompts.map((prompt) => (
            <Link to={`/prompts/${prompt.id}`} key={prompt.id} className="prompt-card">
              <h3>{prompt.title}</h3>
              
              <div className="prompt-meta">
                <span className={`complexity-badge ${getComplexityClass(prompt.complexity)}`}>
                  Level {prompt.complexity}
                </span>
                <span className="prompt-date">
                  {new Date(prompt.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
