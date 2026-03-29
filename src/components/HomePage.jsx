import { useState, useEffect } from 'react';
import { todayStr, fmtDate, round2 } from '../store';

export default function HomePage({ store, showToast, nav }) {
  const { state, activeDate, setActiveDate, addEntry, getMealsOnDate, isAbsentDate, daysVisited, totalBill, totalPaid, balanceDue, renewCycle } = store;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(activeDate);
  const [payAmt, setPayAmt] = useState('');

  const p = state.planDetails || { name: '1 Meal/Day', charge: 2100, cycleDays: 30, mealsPerDay: 1, ratePerMeal: 70 };
  const visited = daysVisited();
  const maxDays = p.cycleDays * (state.cycles || 1);
  const bill = totalBill();
  const paid = totalPaid();
  const due = balanceDue();
  const pct = Math.min(1, visited / maxDays);

  const isToday = activeDate === todayStr();
  const meals = getMealsOnDate(activeDate);
  const absent = isAbsentDate(activeDate);

  useEffect(() => {
    setTempDate(activeDate);
  }, [activeDate]);

  const handleSetDate = () => {
    if (!tempDate) {
      showToast('Pick a date first');
      return;
    }
    setActiveDate(tempDate);
    setShowDatePicker(false);
  };

  const logMeal = (meal) => {
    if (absent) { showToast('❌ Already marked absent for this day'); return; }
    if (meals.includes(meal)) { showToast(`${meal} already logged for this day`); return; }
    if (p.mealsPerDay === 1 && meals.length >= 1) {
      showToast('⚠️ Plan 1 allows 1 meal/day. Switch to Plan 2 for 2 meals.');
      return;
    }
    const amount = round2(p.ratePerMeal);
    addEntry({ type: 'meal', meal, amount, date: activeDate });
    showToast(`✅ ${meal} logged — ₹${amount}`);
    if (visited + 1 >= maxDays) setTimeout(() => showToast('🎉 Cycle days complete!'), 800);
  };

  const logAbsent = () => {
    if (meals.length > 0) { showToast('❌ Already logged a meal for this day'); return; }
    if (absent) { showToast('Already marked absent for this day'); return; }
    addEntry({ type: 'absent', date: activeDate });
    showToast('📌 Absent recorded — no charge');
  };

  const addPayment = () => {
    const amt = parseFloat(payAmt);
    if (!amt || amt <= 0) { showToast('⚠️ Enter a valid amount'); return; }
    addEntry({ type: 'pay', amount: amt, date: todayStr() });
    setPayAmt('');
    showToast(`✅ ₹${amt} payment saved`);
  };

  const quickPays = () => {
    const amts = [500, 1000, 2000].filter(a => a < due + 1);
    if (due > 0) amts.push(due);
    return [...new Set(amts)].sort((a, b) => a - b).slice(0, 4);
  };

  const renderStatus = () => {
    const r = round2(p.ratePerMeal);
    if (absent) return { dot: 'bg-red', txt: 'Absent — no charge for this day' };
    if (meals.includes('Lunch') && meals.includes('Dinner')) return { dot: 'bg-green', txt: `Lunch + Dinner logged (₹${round2(r * 2)} for the day)` };
    if (meals.includes('Lunch')) return { dot: 'bg-accent2', txt: `Lunch logged (₹${r})` };
    if (meals.includes('Dinner')) return { dot: 'bg-accent', txt: `Dinner logged (₹${r})` };
    return { dot: 'bg-border2', txt: 'Nothing logged for this day yet' };
  };
  const status = renderStatus();

  return (
    <div className="py-5">
      <div className="flex items-center justify-between pb-3.5 pt-5">
        <div>
          <div className="text-[10px] tracking-[3px] text-accent uppercase mb-[3px] flex items-center gap-1.5"><img src="/logo.jpg" alt="logo" className="w-[14px] h-[14px] object-contain inline-block -mt-[2px]" /> Mess Tracker</div>
          <h1 className="font-sans font-extrabold text-2xl tracking-[-0.5px]">Daily <span className="text-accent">Log</span></h1>
        </div>
        <div className="bg-s1 border border-border rounded-full px-3.5 py-1.5 text-[11px] text-muted2 text-center leading-[1.4] cursor-pointer transition-colors duration-200 hover:border-accent" onClick={() => nav('summary')} title="View summary">
          <strong className="block text-[15px] text-accent font-sans font-bold">{visited}/{maxDays}</strong>
          <span>{state.cycleName}</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium mb-3 border ${p.mealsPerDay === 2 ? 'bg-accent/10 text-accent border-accent/30' : 'bg-accent2/10 text-accent2 border-accent2/30'}`}>
        {p.mealsPerDay === 2 ? '🌅🌙  2 Meal Plan' : '☀️  1 Meal Plan'} · ₹{p.charge}/{p.cycleDays} days
      </div>

      <div className="bg-s1 border border-border rounded-[20px] p-[18px] mb-3 flex items-center gap-[18px]">
        <div className="relative shrink-0 w-[88px] h-[88px]">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
            <circle className="fill-none stroke-s2 stroke-[8]" cx="44" cy="44" r="36" />
            <circle className="fill-none stroke-accent stroke-[8] stroke-linecap-round transition-all duration-600 ease-[cubic-bezier(.4,0,.2,1)]" cx="44" cy="44" r="36" strokeDasharray="226.2" strokeDashoffset={226.2 * (1 - pct)} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-sans font-extrabold text-[21px] text-accent">{visited}</div>
            <div className="text-[9px] text-muted tracking-[1px] uppercase mt-[1px]">days</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[9px]">
          <div className="flex justify-between items-baseline pb-2 border-b border-border"><span className="text-[10px] text-muted">Total Bill</span><span className="font-sans font-bold text-[15px] text-blue">₹{bill}</span></div>
          <div className="flex justify-between items-baseline pb-2 border-b border-border"><span className="text-[10px] text-muted">Paid</span><span className="font-sans font-bold text-[15px] text-green">₹{paid}</span></div>
          <div className="flex justify-between items-baseline"><span className="text-[10px] text-muted">Balance Due</span><span className="font-sans font-bold text-[15px] text-red">₹{due}</span></div>
        </div>
      </div>

      {visited >= maxDays && (
        <div className="bg-blue/10 border border-blue/30 rounded-[20px] p-4 mb-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="font-sans font-bold text-[14px] text-blue mb-1">Cycle Days Completed!</div>
            <div className="text-[11px] text-blue/80">You have logged all {maxDays} valid days for this cycle limit.</div>
          </div>
          <button
            className="shrink-0 bg-blue text-white border-none rounded-xl px-4 py-2 font-sans font-bold text-xs cursor-pointer hover:brightness-110"
            onClick={() => {
              renewCycle();
              showToast(`✅ Renewed! Extra ${p.cycleDays} days added.`);
            }}
          >
            Renew Cycle (+₹{p.charge})
          </button>
        </div>
      )}

      <div className="bg-s1 border border-border rounded-[20px] p-4 mb-3">
        <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
          <div className="font-sans font-bold text-[15px]">{isToday ? "Today's Entry" : `Entry for ${fmtDate(activeDate)}`}</div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-muted2 bg-bg border border-border rounded-lg px-2.5 py-1 cursor-pointer transition-colors duration-200 flex items-center gap-[5px] hover:border-accent" onClick={() => { setShowDatePicker(!showDatePicker); setTempDate(activeDate); }}>
              📅 <span>{isToday ? 'Today' : fmtDate(activeDate)}</span>
            </div>
          </div>
        </div>

        {!isToday && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow/10 border border-yellow/25 rounded-lg mb-2.5 text-[11px] text-yellow">
            <span>⏮ Logging for: <strong>{fmtDate(activeDate)}</strong></span>
            <button className="ml-auto bg-transparent border-none text-yellow cursor-pointer text-[11px] font-mono underline" onClick={() => setActiveDate(todayStr())}>Back to Today</button>
          </div>
        )}

        {showDatePicker && (
          <div className="flex mb-3 gap-2 items-center">
            <input type="date" className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-tx font-mono text-[13px] outline-none focus:border-accent" value={tempDate} max={todayStr()} min={state.startDate || ''} onChange={e => setTempDate(e.target.value)} />
            <button className="px-3.5 py-2 rounded-lg border-none bg-accent text-white font-sans font-bold text-xs cursor-pointer" onClick={handleSetDate}>Set</button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            className={`border border-accent2/25 rounded-[14px] p-3.5 pb-[14px] pt-[14px] cursor-pointer transition-all duration-150 flex flex-col items-center gap-[5px] font-mono bg-accent2/10 text-accent2 hover:bg-accent2/20 hover:border-accent2/50 hover:-translate-y-[2px] active:scale-95 ${absent || meals.includes('Lunch') || (p.mealsPerDay === 1 && meals.length >= 1) ? 'opacity-40 pointer-events-none' : ''}`}
            onClick={() => logMeal('Lunch')}
          >
            <span className="text-[20px]">☀️</span>
            <span className="text-[11px] font-medium tracking-[0.5px]">LUNCH</span>
            <span className="text-[10px] opacity-75">₹{round2(p.ratePerMeal)}</span>
          </button>
          <button
            className={`border border-accent/25 rounded-[14px] p-3.5 pb-[14px] pt-[14px] cursor-pointer transition-all duration-150 flex flex-col items-center gap-[5px] font-mono bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/50 hover:-translate-y-[2px] active:scale-95 ${absent || meals.includes('Dinner') || (p.mealsPerDay === 1 && meals.length >= 1) ? 'opacity-40 pointer-events-none' : ''}`}
            onClick={() => logMeal('Dinner')}
          >
            <span className="text-[20px]">🌙</span>
            <span className="text-[11px] font-medium tracking-[0.5px]">DINNER</span>
            <span className="text-[10px] opacity-75">₹{round2(p.ratePerMeal)}</span>
          </button>
          <button
            className={`border border-red/20 rounded-[14px] p-3.5 pb-[14px] pt-[14px] cursor-pointer transition-all duration-150 flex flex-col items-center gap-[5px] font-mono bg-red/10 text-red hover:bg-red/15 hover:border-red/40 hover:-translate-y-[2px] active:scale-95 ${meals.length > 0 || absent ? 'opacity-40 pointer-events-none' : ''}`}
            onClick={logAbsent}
          >
            <span className="text-[20px]">❌</span>
            <span className="text-[11px] font-medium tracking-[0.5px]">ABSENT</span>
            <span className="text-[10px] opacity-75">no charge</span>
          </button>
        </div>

        <div className="mt-2.5 px-3 py-2 bg-bg border border-border rounded-xl flex items-center gap-2 text-xs text-muted2 min-h-[36px]">
          <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${status.dot}`}></div>
          <span>{status.txt}</span>
        </div>
      </div>

      <div className="bg-s1 border border-border rounded-[20px] p-4 mb-3">
        <div className="font-sans font-bold text-[15px] mb-3">💳 Record Payment</div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-bg border border-border rounded-xl px-3.5 py-2.5 text-tx font-mono text-base outline-none transition-all duration-200 focus:border-green focus:shadow-[0_0_0_3px_rgba(74,222,128,0.12)] appearance-none placeholder-muted"
            type="number"
            placeholder="Amount (₹)"
            min="1"
            value={payAmt}
            onChange={e => setPayAmt(e.target.value)}
          />
          <button className="bg-green text-white border-none rounded-xl px-[18px] py-2.5 font-sans font-bold text-sm cursor-pointer transition-all duration-200 whitespace-nowrap hover:brightness-110 hover:-translate-y-[1px]" onClick={addPayment}>Pay</button>
        </div>
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {quickPays().map(a => (
            <button key={a} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-muted2 font-mono text-xs cursor-pointer transition-all duration-150 hover:border-green hover:text-green" onClick={() => { setPayAmt(a); document.querySelector('input[placeholder="Amount (₹)"]')?.focus(); }}>₹{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
