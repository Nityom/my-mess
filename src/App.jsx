import { useState, useRef } from 'react';
import { useStore } from './store';
import SetupPage from './components/SetupPage';
import HomePage from './components/HomePage';
import LogPage from './components/LogPage';
import SummaryPage from './components/SummaryPage';
import BottomNav from './components/BottomNav';

export default function App() {
  const store = useStore();
  const { state, resetAll } = store;
  
  const [activePage, setActivePage] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toastTimeout = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setIsToastOpen(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setIsToastOpen(false), 2800);
  };

  const confirmReset = () => {
    resetAll();
    setIsModalOpen(false);
    setActivePage('home');
  };

  if (!state.setup) {
    return (
      <div className="app-wrap">
        <SetupPage store={store} showToast={showToast} />
        {/* Toast */}
        <div className={`fixed bottom-[80px] left-1/2 -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] bg-s2 border border-border2 rounded-xl px-[18px] py-2.5 text-[13px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] whitespace-nowrap z-[200] pointer-events-none max-w-[90vw] text-center ${isToastOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {toastMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrap">
      <div className={`${activePage === 'home' ? 'block' : 'hidden'}`}>
        <HomePage store={store} showToast={showToast} nav={setActivePage} />
      </div>
      <div className={`${activePage === 'log' ? 'block' : 'hidden'}`}>
        <LogPage store={store} showModal={() => setIsModalOpen(true)} />
      </div>
      <div className={`${activePage === 'summary' ? 'block' : 'hidden'}`}>
        <SummaryPage store={store} showModal={() => setIsModalOpen(true)} />
      </div>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />

      {/* Toast */}
      <div className={`fixed bottom-[80px] left-1/2 -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] bg-s2 border border-border2 rounded-xl px-[18px] py-2.5 text-[13px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] whitespace-nowrap z-[200] pointer-events-none max-w-[90vw] text-center ${isToastOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {toastMsg}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-end justify-center p-4">
          <div className="bg-s1 border border-border rounded-t-[20px] rounded-b-[16px] p-6 w-full max-w-[430px] animate-[slideUp_0.3s_ease]">
            <h3 className="font-sans font-extrabold text-lg mb-2">⚠️ Reset Cycle?</h3>
            <p className="text-xs text-muted leading-[1.7] mb-[18px]">This will permanently delete all entries, payments and settings. Cannot be undone.</p>
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-xl border border-border bg-transparent text-tx font-sans font-bold cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="flex-1 p-3 rounded-xl border-none bg-red text-white font-sans font-bold cursor-pointer" onClick={confirmReset}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
