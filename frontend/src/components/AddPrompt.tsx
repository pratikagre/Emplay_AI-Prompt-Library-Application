import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AddPrompt() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [complexity, setComplexity] = useState(5);
  
  const [errors, setErrors] = useState<{title?: string; content?: string; submit?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters.';
    if (content.trim().length < 20) newErrors.content = 'Content must be at least 20 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/prompts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, complexity })
      });
      
      if (!response.ok) {
        let errorMsg = `Server error ${response.status}`;
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch (e) {
          errorMsg += '. Ensure backend server is running.';
        }
        throw new Error(errorMsg);
      }
      
      const newPrompt = await response.json();
      navigate(`/prompts/${newPrompt.id}`);
    } catch (err: any) {
      setErrors({ submit: err.message || 'An error occurred during submission.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <Link to="/prompts" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back
      </Link>
      
      <h2 className="page-title text-center" style={{marginBottom: '2rem'}}>Create New Prompt</h2>
      
      {errors.submit && (
        <div className="error-message" style={{marginBottom: '1rem', padding: '1rem', background: 'rgba(255, 59, 59, 0.1)', borderRadius: '8px'}}>
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Prompt Title</label>
          <input 
            type="text" 
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cyberpunk Neon Cityscape"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Prompt Content</label>
          <textarea 
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the full prompt text here..."
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="complexity">Complexity Level (1-10)</label>
          <input 
            type="range" 
            id="complexity"
            min="1" 
            max="10" 
            value={complexity}
            onChange={(e) => setComplexity(parseInt(e.target.value))}
          />
          <div className="complexity-display">{complexity}</div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting}
          style={{width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem'}}
        >
          {isSubmitting ? 'Saving Prompt...' : 'Save Prompt'}
        </button>
      </form>
    </div>
  );
}
