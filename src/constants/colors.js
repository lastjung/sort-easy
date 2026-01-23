export const COLORS = {
    // Ultra-Vibrant Elite Neon Palette (Zero Transparency)
    SORTED: 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]',       // 완성 - 브라이트 시안
    UNSORTED: 'bg-indigo-500',                                          // 기본 - 선명한 인디고 (더 이상 흑백이 아님)
    COMPARE: 'bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]',    // 비교 - 네온 옐로우
    SWAP: 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.9)]',         // 스왑 - 네온 레드
    TARGET: 'bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.6)]',    // 타겟 - 네온 핑크
    
    // Backgrounds
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/95',
    BG_SECTION: 'bg-black/40',
    
    // Text
    TEXT_MAIN: 'text-white',
    TEXT_MUTED: 'text-slate-400',
    TEXT_ACCENT: 'text-cyan-400',
    
    // UI Accents
    ACCENT: 'indigo-500',
    ACCENT_HOVER: 'indigo-400'
};

export const LEGEND_ITEMS = [
    { label: 'Unsorted', color: 'bg-indigo-500' },
    { label: 'Compare', color: 'bg-yellow-300' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-fuchsia-500' },
    { label: 'Sorted', color: 'bg-cyan-400' },
];
