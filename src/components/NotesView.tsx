import { useState } from 'react';
import type { NoteItem } from '../types';
import { FileText, PlusCircle, Pin, Trash2, Search } from 'lucide-react';

interface NotesViewProps {
  notes: NoteItem[];
  onDeleteNote: (id: string) => void;
  onOpenCreateNote: () => void;
  onTogglePin: (id: string, current: boolean) => void;
}

export default function NotesView({
  notes,
  onDeleteNote,
  onOpenCreateNote,
  onTogglePin
}: NotesViewProps) {
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search & Add Header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            gap: 8
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search private notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              width: '100%'
            }}
          />
        </div>

        <button
          onClick={onOpenCreateNote}
          style={{
            background: 'var(--accent-call)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontWeight: 700,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <PlusCircle size={15} />
          New Note
        </button>
      </div>

      {sortedNotes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)',
            marginTop: 10
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <FileText size={20} color="var(--accent-info)" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {search ? 'No Matching Notes' : 'Vault Notes Empty'}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 260, margin: '0 auto 16px auto' }}>
            Store checklists, thoughts, gift ideas, or phone call summaries completely offline.
          </p>
          {!search && (
            <button
              onClick={onOpenCreateNote}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent-call)',
                color: 'var(--accent-call)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Create First Note
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${note.isPinned ? 'var(--accent-call)' : 'var(--border-subtle)'}`,
                borderLeft: `4px solid ${note.colorTag || 'var(--accent-call)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {note.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => onTogglePin(note.id, note.isPinned)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: note.isPinned ? 'var(--accent-call)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 4
                    }}
                    title={note.isPinned ? 'Unpin' : 'Pin to Top'}
                  >
                    <Pin size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                    title="Delete Note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              >
                {note.content}
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 10 }}>
                Updated {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
