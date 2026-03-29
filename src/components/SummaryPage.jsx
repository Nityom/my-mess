import { round2 } from '../store';

export default function SummaryPage({ store, showModal }) {
  const { state, daysVisited, absentDays, mealCnt, totalCharge, totalBill, totalPaid, balanceDue } = store;
  
  const p = state.planDetails || { name: '1 Meal/Day', charge: 2100, cycleDays: 30, mealsPerDay: 1, ratePerMeal: 70 };
  const visited = daysVisited();
  const maxDays = p.cycleDays * (state.cycles || 1);

  return (
    <div className="pt-5 pb-6">
      <div className="mb-3">
        <div className="text-[10px] tracking-[2px] uppercase text-muted mb-2 pt-1">📊 Attendance</div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Days Visited</span>
          <span className="font-sans font-bold text-sm text-accent">{visited}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Absent Days Logged</span>
          <span className="font-sans font-bold text-sm text-red">{absentDays()}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Lunch Meals</span>
          <span className="font-sans font-bold text-sm text-accent2">{mealCnt('Lunch')}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Dinner Meals</span>
          <span className="font-sans font-bold text-sm text-accent">{mealCnt('Dinner')}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Cycle Days Remaining</span>
          <span className="font-sans font-bold text-sm text-blue">{Math.max(0, maxDays - visited)}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] tracking-[2px] uppercase text-muted mb-2 pt-1">💰 Billing</div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Plan</span>
          <span className="font-sans font-bold text-sm text-yellow">{p.name}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Active Cycles</span>
          <span className="font-sans font-bold text-sm">{state.cycles || 1}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Base Plan Charge</span>
          <span className="font-sans font-bold text-sm">₹{p.charge}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Meal Charges</span>
          <span className="font-sans font-bold text-sm text-blue">₹{totalCharge()}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Opening Balance Due</span>
          <span className="font-sans font-bold text-sm text-muted2">₹{state.openingDue}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Total Bill</span>
          <span className="font-sans font-bold text-sm text-blue">₹{totalBill()}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-s1 border border-border rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-muted2">Total Paid</span>
          <span className="font-sans font-bold text-sm text-green">₹{totalPaid()}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 px-3.5 bg-red/5 border border-red/30 rounded-xl mb-1.5 last:mb-0">
          <span className="text-xs text-red">Balance Due</span>
          <span className="font-sans font-bold text-lg text-red">₹{balanceDue()}</span>
        </div>
      </div>

      <button className="w-full p-3 rounded-[14px] text-xs text-red bg-transparent border border-red/25 cursor-pointer font-mono transition-colors duration-150 mb-4 hover:bg-red/10" onClick={showModal}>🗑 Reset / New Cycle</button>
    </div>
  );
}
