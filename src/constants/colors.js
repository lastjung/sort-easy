export const COLORS = {
    // Ultra-Vibrant Neon Theme (Optimized for Video Recording)
    SORTED: 'from-emerald-400 to-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]', // 완성 - 비비드 그린
    UNSORTED: 'from-slate-500 to-slate-600',                                         // 기본 - 슬레이트 (충분히 밝게)
    COMPARE: 'from-yellow-300 to-yellow-400 shadow-[0_0_25px_rgba(253,224,71,0.8)]', // 비교 - 네온 옐로우 (초고계조)
    SWAP: 'from-rose-500 to-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.9)]',         // 스왑 - 네온 레드 (초고계조)
    TARGET: 'from-cyan-400 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]',      // 타겟 - 엘리트 블루
    
    // Backgrounds
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/95',                      // 배경을 더 어둡게 하여 바의 명도 강조
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
    { label: 'Unsorted', color: 'bg-slate-500' },
    { label: 'Compare', color: 'bg-yellow-300' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-cyan-400' },
    { label: 'Sorted', color: 'bg-emerald-400' },
];
