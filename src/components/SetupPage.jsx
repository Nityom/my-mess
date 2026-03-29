import { useState } from 'react';
import { todayStr } from '../store';

export default function SetupPage({ store, showToast }) {
  const [setupPlan, setSetupPlan] = useState(1);
  const [charge, setCharge] = useState(2100);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(todayStr());
  const [openingDue, setOpeningDue] = useState('');

  const handleStart = () => {
    const finalName = name.trim() || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const finalStart = startDate || todayStr();
    const finalOpening = parseFloat(openingDue) || 0;
    
    const finalCharge = parseFloat(charge) || (setupPlan === 1 ? 2100 : 3500);
    const ratePerMeal = finalCharge / 30 / setupPlan;
    
    store.setSetup({
      planDetails: {
        name: `${setupPlan} Meal${setupPlan > 1 ? 's' : ''}/Day`,
        charge: finalCharge,
        cycleDays: 30,
        mealsPerDay: setupPlan,
        ratePerMeal
      },
      cycleName: finalName,
      startDate: finalStart,
      openingDue: finalOpening,
      entries: []
    });
    
    store.setActiveDate(todayStr());

    const daysBack = Math.floor((new Date(todayStr()) - new Date(finalStart)) / 86400000);
    if (daysBack > 0) {
      showToast(`✅ Setup done! You started ${daysBack} day${daysBack > 1 ? 's' : ''} ago — log past days using 📅`);
    } else {
      showToast('✅ Setup done! Start logging.');
    }
  };

  return (
    <div className="py-6">
      <div className="text-4xl mb-3">🍽️</div>
      <div className="font-sans font-extrabold text-[22px] mb-1">Setup Your Mess</div>
      <div className="text-xs text-muted mb-[22px] leading-[1.7]">Fill this once — all data saves to your device automatically.</div>

      <div className="mb-3.5">
        <label className="block text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">Choose Your Plan</label>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div 
            className={`bg-s1 border-2 rounded-[14px] p-3 cursor-pointer transition-all duration-200 text-center hover:border-border2 ${setupPlan === 1 ? 'border-accent2 bg-accent2/10' : 'border-border'}`}
            onClick={() => { setSetupPlan(1); setCharge(2100); }}
          >
            <div className="text-2xl mb-1.5">☀️</div>
            <div className="font-sans font-bold text-sm mb-0.5">1 Meal/Day</div>
            <div className="text-xs text-muted2">Default: ₹2,100</div>
          </div>
          <div 
            className={`bg-s1 border-2 rounded-[14px] p-3 cursor-pointer transition-all duration-200 text-center hover:border-border2 ${setupPlan === 2 ? 'border-accent bg-accent/10' : 'border-border'}`}
            onClick={() => { setSetupPlan(2); setCharge(3500); }}
          >
            <div className="text-2xl mb-1.5">🌅🌙</div>
            <div className="font-sans font-bold text-sm mb-0.5">2 Meals/Day</div>
            <div className="text-xs text-muted2">Default: ₹3,500</div>
          </div>
        </div>
      </div>

      <div className="mb-3.5">
        <label className="block text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">Plan Price for 30 days (₹)</label>
        <input 
          type="number" 
          value={charge} 
          onChange={e => setCharge(e.target.value)} 
          className="w-full bg-s1 border border-border rounded-xl px-3.5 py-3 text-[15px] outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(192,132,252,0.12)] appearance-none"
        />
      </div>

      <div className="mb-3.5">
        <label className="block text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">Cycle name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. April 2025"
          className="w-full bg-s1 border border-border rounded-xl px-3.5 py-3 text-[15px] outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(192,132,252,0.12)] appearance-none"
        />
      </div>
      
      <div className="mb-3.5 flex flex-col">
        <label className="block text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">
          Cycle start date <span className="text-muted">(set if already started)</span>
        </label>
        <input 
          type="date" 
          value={startDate} 
          max={todayStr()}
          onChange={e => setStartDate(e.target.value)}
          className="w-full bg-s1 border border-border rounded-xl px-3.5 py-3 text-[15px] outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(192,132,252,0.12)] appearance-none"
        />
      </div>
      
      <div className="mb-3.5">
        <label className="block text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">Opening balance due (₹)</label>
        <input 
          type="number" 
          value={openingDue} 
          min="0"
          onChange={e => setOpeningDue(e.target.value)}
          className="w-full bg-s1 border border-border rounded-xl px-3.5 py-3 text-[15px] outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(192,132,252,0.12)] appearance-none"
        />
      </div>
      
      <button 
        className="w-full p-3.5 rounded-[14px] border-none bg-accent text-white font-sans font-extrabold text-base cursor-pointer transition-all duration-200 mt-1 hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(192,132,252,0.3)]"
        onClick={handleStart}
      >
        Start Tracking →
      </button>
    </div>
  );
}
