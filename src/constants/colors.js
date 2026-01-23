export const COLORS = {
    // Final Aesthetic System (User Requested: Blue Base, Purple Focus)
    SORTED: 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]',     // 완료 - 에메랄드 그린
    UNSORTED: 'bg-blue-600',                                             // 기본 - 선명한 파란색 (Blue Base)
    COMPARE: 'bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]',    // 비교 - 네온 옐로우
    SWAP: 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.9)]',         // 스왑 - 네온 레드
    TARGET: 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]',     // 기둥/타켓 - 보라색 (Purple Column)
    
    // Backgrounds
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/95',
    BG_SECTION: 'bg-black/40',
    
    // Text
    TEXT_MAIN: 'text-white',
    TEXT_MUTED: 'text-slate-500',
    TEXT_ACCENT: 'text-emerald-400',
    
    // UI Accents
    ACCENT: 'blue-500',
    ACCENT_HOVER: 'blue-400'
};

export const LEGEND_ITEMS = [
    { label: 'Unsorted', color: 'bg-blue-600' },
    { label: 'Compare', color: 'bg-yellow-300' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-purple-500' },
    { label: 'Sorted', color: 'bg-emerald-500' },
];
