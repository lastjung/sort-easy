export const COLORS = {
    // Neon Electric Theme (High Visibility for Video)
    SORTED: 'from-emerald-400 to-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.4)]', // 완성 - 에메랄드 그린
    UNSORTED: 'from-slate-600/60 to-slate-700/60',                                    // 대기 - 미디엄 슬레이트 (적절한 가시성)
    COMPARE: 'from-yellow-300 to-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.7)]', // 비교 - 네온 옐로우
    SWAP: 'from-rose-500 to-rose-600 shadow-[0_0_25px_rgba(244,63,94,0.8)]',         // 스왑 - 네온 레드
    TARGET: 'from-cyan-400 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]',      // 타겟 - 엘리트 블루
    
    // Backgrounds
    BG_MAIN: 'bg-slate-950',
    BG_CARD: 'bg-slate-900/90',                      // 더 진한 배경으로 네온 대비 극대화
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
    { label: 'Unsorted', color: 'bg-slate-600' },
    { label: 'Compare', color: 'bg-yellow-300' },
    { label: 'Swap', color: 'bg-rose-500' },
    { label: 'Focus', color: 'bg-cyan-400' },
    { label: 'Sorted', color: 'bg-emerald-400' },
];
