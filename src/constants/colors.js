export const COLORS = {
    // Ultra-Vibrant Elite Neon Palette (V3 - Anti-Grey)
    SORTED: 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]',       // 완성 - 브라이트 그린
    UNSORTED: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]',      // 기본 - 선명한 블루 (High Visibility)
    COMPARE: 'bg-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.9)]',    // 비교 - 네온 옐로우
    SWAP: 'bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,1.0)]',         // 스왑 - 네온 레드
    TARGET: 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]',     // 기둥 - 보라색
    
    // Backgrounds
    BG_MAIN: 'bg-black',                             // 배경을 완전 검정으로 하여 색상 대비 극대질
    BG_CARD: 'bg-slate-900/95',
    BG_SECTION: 'bg-black/40',
    
    // Text
    TEXT_MAIN: 'text-white',
    TEXT_MUTED: 'text-slate-500',
    TEXT_ACCENT: 'text-emerald-400',
    
    // UI Accents
    ACCENT: 'blue-500',
    ACCENT_HOVER: 'blue-400',
    // --- Multi-colors for Merge Sort Groups ---
    GROUP_PALETTE: [
        'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]',
        'bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]',
        'bg-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.5)]',
        'bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]',
        'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
        'bg-neutral-500 shadow-[0_0_15px_rgba(115,115,115,0.5)]',
        'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        'bg-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.5)]',
        'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.5)]',
        'bg-teal-300 shadow-[0_0_15px_rgba(94,234,212,0.5)]',
        'bg-stone-500 shadow-[0_0_15px_rgba(120,113,108,0.5)]',
        'bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]',
        'bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.5)]',
        'bg-sky-600 shadow-[0_0_15px_rgba(2,132,199,0.5)]',
    ]
};

export const LEGEND_ITEMS = [
    { label: 'Unsorted', color: 'bg-blue-500' },
    { label: 'Compare', color: 'bg-yellow-300' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-purple-500' },
    { label: 'Sorted', color: 'bg-emerald-400' },
];
