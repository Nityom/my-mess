import { useState, useEffect } from 'react';

const KEY = 'mess_v4';

const defaultState = {
  setup: false,
  planDetails: { name: '1 Meal/Day', charge: 2100, cycleDays: 30, mealsPerDay: 1, ratePerMeal: 70 },
  cycleName: '',
  startDate: '', // ISO string
  openingDue: 0,
  cycles: 1,
  entries: [] // {type:'meal'|'absent'|'pay', meal?:'Lunch'|'Dinner', amount, date, ts}
};

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(d) {
  if (!d) return '--';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function useStore() {
  const [state, setState] = useState(() => {
    const r = localStorage.getItem(KEY);
    if (r) {
      try {
        const parsed = JSON.parse(r);
        parsed.cycles = parsed.cycles || 1;
        return { ...defaultState, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultState;
  });

  const [activeDate, setActiveDate] = useState(todayStr());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const setSetup = (setupData) => {
    setState({ ...state, ...setupData, setup: true });
  };

  const addEntry = (entry) => {
    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, { ...entry, ts: Date.now() }]
    }));
  };

  const renewCycle = () => {
    setState((prev) => ({
      ...prev,
      cycles: (prev.cycles || 1) + 1
    }));
  };

  const resetAll = () => {
    localStorage.removeItem(KEY);
    setState(defaultState);
  };

  // Computations
  const getMealsOnDate = (date) => state.entries.filter(e => e.type === 'meal' && e.date === date).map(e => e.meal);
  const isAbsentDate = (date) => state.entries.some(e => e.type === 'absent' && e.date === date);
  const daysVisited = () => new Set(state.entries.filter(e => e.type === 'meal').map(e => e.date)).size;
  const absentDays = () => state.entries.filter(e => e.type === 'absent').length;
  const mealCnt = (type) => state.entries.filter(e => e.type === 'meal' && e.meal === type).length;
  const totalCharge = () => round2((state.planDetails?.charge || 2100) * (state.cycles || 1));
  const totalBill = () => round2(totalCharge() + state.openingDue);
  const totalPaid = () => round2(state.entries.filter(e => e.type === 'pay').reduce((s, e) => s + e.amount, 0));
  const balanceDue = () => round2(Math.max(0, totalBill() - totalPaid()));

  return {
    state,
    activeDate,
    setActiveDate,
    setSetup,
    addEntry,
    renewCycle,
    resetAll,
    getMealsOnDate,
    isAbsentDate,
    daysVisited,
    absentDays,
    mealCnt,
    totalCharge,
    totalBill,
    totalPaid,
    balanceDue
  };
}
