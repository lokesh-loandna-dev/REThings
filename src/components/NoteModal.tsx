import { useState } from 'react';
import { X, FileText, Pin } from 'lucide-react';

interface NoteModalProps {
  onClose: () => void;
  onSave: (data: { title: string; content: string; colorTag: string; isPinned: boolean }) => void;
}

const COLOR_OPTIONS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#64748B'  // Slate
];

export default function NoteModal({ onClose, onSave }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorTag, setColorTag] = useState('#10B981');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onSave({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      colorTag,
      isPinned
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle"></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', padding: 7, borderRadius: 8 }}>
              <FileText size={18} color="var(--accent-info)" />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Create Private Note
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Call Discussion Points, Wishlist..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Note Content
            </label>
            <textarea
              placeholder="Write your private notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* Color Tag Selection */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Color Categorization Tag
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorTag(c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: c,
                    border: colorTag === c ? '2px solid #FFFFFF' : '2px solid transparent',
                    cursor: 'pointer',
                    transform: colorTag === c ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Pin toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Pin size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Pin Note to Top
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-call)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                background: 'var(--accent-call)',
                border: 'none',
                color: 'var(--text-inverse)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
