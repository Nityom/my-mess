import { fmtDate, todayStr } from '../store';

export default function LogPage({ store, showModal }) {
  const { state } = store;
  
  const all = [...state.entries].sort((a, b) => b.ts - a.ts);
  
  const groups = {};
  all.forEach(e => {
    const d = e.date || todayStr();
    if (!groups[d]) groups[d] = [];
    groups[d].push(e);
  });
  
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="pt-5">
      <div className="bg-s1 border border-border rounded-[20px] p-4 mb-3">
        <div className="flex justify-between items-center mb-3.5">
          <div className="font-sans font-bold text-[15px]">📋 Full Log</div>
          <button className="text-[10px] text-red bg-transparent border border-red/25 rounded-md px-2 py-1 cursor-pointer font-mono transition-colors duration-150 hover:bg-red/10" onClick={showModal}>Reset</button>
        </div>
        
        <div className="max-h-[340px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-border2 [&::-webkit-scrollbar-thumb]:rounded-[3px]">
          {!all.length ? (
            <div className="text-center py-7 text-muted text-xs leading-[2]">No entries yet.<br/>Go Home → tap a meal button.</div>
          ) : (
            sortedDates.map(date => {
              const items = groups[date].sort((a, b) => b.ts - a.ts);
              return (
                <div key={date} className="mb-0.5">
                  <div className="text-[10px] text-muted tracking-[1px] py-2 pb-1 uppercase border-b border-border mb-0.5">{fmtDate(date)}</div>
                  {items.map(e => {
                    const t = new Date(e.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    if (e.type === 'meal') {
                      const isLunch = e.meal === 'Lunch';
                      return (
                        <div key={e.ts} className="flex items-center gap-2.5 py-2 border-b border-border/60 last:border-b-0 animate-[slideIn_0.2s_ease]">
                          <div className={`w-[7px] h-[7px] rounded-full shrink-0 ${isLunch ? 'bg-accent2' : 'bg-accent'}`}></div>
                          <div className="flex-1">
                            <div className="text-xs text-tx">{e.meal}</div>
                            <div className="text-[10px] text-muted mt-[1px]">{t}</div>
                          </div>
                          <div className={`font-sans font-bold text-[13px] ${isLunch ? 'text-accent2' : 'text-accent'}`}>₹{e.amount}</div>
                        </div>
                      );
                    } else if (e.type === 'absent') {
                      return (
                        <div key={e.ts} className="flex items-center gap-2.5 py-2 border-b border-border/60 last:border-b-0 animate-[slideIn_0.2s_ease]">
                          <div className="w-[7px] h-[7px] rounded-full shrink-0 bg-red"></div>
                          <div className="flex-1">
                            <div className="text-xs text-tx">Absent</div>
                            <div className="text-[10px] text-muted mt-[1px]">{t}</div>
                          </div>
                          <div className="font-sans font-bold text-[13px] text-red">₹0</div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={e.ts} className="flex items-center gap-2.5 py-2 border-b border-border/60 last:border-b-0 animate-[slideIn_0.2s_ease]">
                          <div className="w-[7px] h-[7px] rounded-full shrink-0 bg-green"></div>
                          <div className="flex-1">
                            <div className="text-xs text-tx">Payment</div>
                            <div className="text-[10px] text-muted mt-[1px]">{t}</div>
                          </div>
                          <div className="font-sans font-bold text-[13px] text-green">+₹{e.amount}</div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
