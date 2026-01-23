export const COLORS = {
    // State Colors (High Contrast for Video Recording)
    SORTED: 'from-cyan-400 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]', // Completed Elite Blue
    UNSORTED: 'from-slate-500 to-slate-600',                                     // Idle Base
    COMPARE: 'from-amber-400 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]', // Active Compare (Yellow)
    SWAP: 'from-emerald-400 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]', // Active Swap (Green)
    TARGET: 'from-rose-500 to-rose-600',                                           // Focus/Pivot (Red)
    
    // Backgrounds (Premium Deep Dark)
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/60',
    BG_SECTION: 'bg-slate-800/40',
    
    // Text
    TEXT_MAIN: 'text-slate-50',
    TEXT_MUTED: 'text-slate-400',
    TEXT_ACCENT: 'text-cyan-400',
    
    // UI Accents
    ACCENT: 'cyan-500',
    ACCENT_HOVER: 'cyan-400'
};

export const LEGEND_ITEMS = [
    { label: 'Unsorted', color: 'bg-slate-500' },
    { label: 'Compare', color: 'bg-amber-400' },
    { label: 'Swap', color: 'bg-emerald-500' },
    { label: 'Focus', color: 'bg-rose-500' },
    { label: 'Sorted', color: 'bg-cyan-500' },
];
