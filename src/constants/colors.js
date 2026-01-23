export const COLORS = {
    // High-Contrast Solid Neon Palette (Optimized for Visibility)
    SORTED: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',     // 완성 - 선명한 초록
    UNSORTED: 'bg-slate-700',                                            // 대기 - 진한 회색 (배경보다 밝게)
    COMPARE: 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]',    // 비교 - 노랑
    SWAP: 'bg-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]',         // 스왑 - 빨강
    TARGET: 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',        // 타겟 - 하늘색
    
    // Backgrounds
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/95',
    BG_SECTION: 'bg-black/40',
    
    // Text
    TEXT_MAIN: 'text-white',
    TEXT_MUTED: 'text-slate-500',
    TEXT_ACCENT: 'text-emerald-400',
    
    // UI Accents
    ACCENT: 'emerald-500',
    ACCENT_HOVER: 'emerald-400'
};

export const LEGEND_ITEMS = [
    { label: 'Unsorted', color: 'bg-slate-700' },
    { label: 'Compare', color: 'bg-yellow-400' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-cyan-400' },
    { label: 'Sorted', color: 'bg-emerald-500' },
];
