import { Calendar, Cake, FileText, Plus, ShieldCheck } from 'lucide-react';

export type TabType = 'timeline' | 'birthdays' | 'notes' | 'vault';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreateMenu: () => void;
}

export default function BottomNav({ currentTab, onSelectTab, onOpenCreateMenu }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${currentTab === 'timeline' ? 'active' : ''}`}
        onClick={() => onSelectTab('timeline')}
      >
        <Calendar size={19} />
        <span>Timeline</span>
      </button>

      <button
        className={`nav-item ${currentTab === 'birthdays' ? 'active' : ''}`}
        onClick={() => onSelectTab('birthdays')}
      >
        <Cake size={19} />
        <span>Birthdays</span>
      </button>

      <div className="nav-fab-wrap">
        <button
          className="nav-fab"
          aria-label="Create New Item"
          onClick={onOpenCreateMenu}
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      <button
        className={`nav-item ${currentTab === 'notes' ? 'active' : ''}`}
        onClick={() => onSelectTab('notes')}
      >
        <FileText size={19} />
        <span>Notes</span>
      </button>

      <button
        className={`nav-item ${currentTab === 'vault' ? 'active' : ''}`}
        onClick={() => onSelectTab('vault')}
      >
        <ShieldCheck size={19} />
        <span>Vault</span>
      </button>
    </nav>
  );
}
