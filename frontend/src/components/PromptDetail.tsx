import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prompt } from '../types';

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`/api/prompts/${id}/`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Prompt not found');
          throw new Error('Failed to fetch prompt details');
        }
        const data = await response.json();
        setPrompt(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  const handleCopy = async () => {
    if (prompt) {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(prompt.content);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = prompt.content;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Could not copy to clipboard. Please select the text manually.');
      }
    }
  };

  const getComplexityClass = (complexity: number) => {
    if (complexity <= 3) return 'complexity-low';
    if (complexity <= 7) return 'complexity-medium';
    return 'complexity-high';
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  if (error || !prompt) return <div className="empty-state"><h3>Error</h3><p className="error-message">{error}</p><Link to="/prompts" className="btn-secondary">Go Back</Link></div>;

  return (
    <div className="detail-container">
      <Link to="/prompts" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Prompts
      </Link>
      
      <div className="detail-header">
        <h2 className="page-title">{prompt.title}</h2>
        <div className="detail-meta-bar">
          <span className={`complexity-badge ${getComplexityClass(prompt.complexity)}`}>
            Complexity Level: {prompt.complexity}/10
          </span>
          <span className="prompt-date">
            Created on {new Date(prompt.created_at).toLocaleDateString()}
          </span>
          {prompt.view_count !== undefined && (
            <span className="view-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Views: <strong>{prompt.view_count}</strong>
            </span>
          )}
        </div>
      </div>
      
      <div className="prompt-content-box">
        <button onClick={handleCopy} className="copy-btn" title="Copy to clipboard">
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Prompt</>
          )}
        </button>
        <p>{prompt.content}</p>
      </div>
    </div>
  );
}
