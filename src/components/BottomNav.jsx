export default function BottomNav({ activePage, setActivePage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border flex py-2 z-50">
      <button 
        className={`flex-1 flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer font-mono text-[10px] py-1.5 transition-colors duration-150 ${activePage === 'home' ? 'text-accent' : 'text-muted'}`}
        onClick={() => setActivePage('home')}
      >
        <span className="text-lg">🏠</span>
        <span>Home</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer font-mono text-[10px] py-1.5 transition-colors duration-150 ${activePage === 'log' ? 'text-accent' : 'text-muted'}`}
        onClick={() => setActivePage('log')}
      >
        <span className="text-lg">📋</span>
        <span>Log</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer font-mono text-[10px] py-1.5 transition-colors duration-150 ${activePage === 'summary' ? 'text-accent' : 'text-muted'}`}
        onClick={() => setActivePage('summary')}
      >
        <span className="text-lg">📊</span>
        <span>Summary</span>
      </button>
    </div>
  );
}
