export const oddEvenSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setGroupIndices,
    setDisableGroupGaps,
    setDescription,
    playSound,
    wait,
    sortingRef,
    countCompare,
    countSwap,
    msg
}) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const pairPalette = [
        COLORS.GROUP_PALETTE[1],
        COLORS.GROUP_PALETTE[3],
        COLORS.GROUP_PALETTE[4],
        COLORS.GROUP_PALETTE[8],
        COLORS.GROUP_PALETTE[9],
        COLORS.GROUP_PALETTE[11],
        COLORS.GROUP_PALETTE[13]
    ];

    const paintGroups = (phase) => {
        const groups = {};
        for (let i = 0; i < n; i++) {
            groups[i] = COLORS.GROUP_PALETTE[1];
        }
        let pairIdx = 0;
        for (let i = phase; i < n - 1; i += 2) {
            const pairColor = pairPalette[pairIdx % pairPalette.length];
            groups[i] = pairColor;
            groups[i + 1] = pairColor;
            pairIdx++;
        }
        setGroupIndices(groups);
    };

    setSortedIndices([]);
    setDisableGroupGaps?.(true);
    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    let swapped = true;

    while (swapped) {
        if (!sortingRef.current) return false;
        swapped = false;
        
        for (const phase of [1, 0]) {
            paintGroups(phase);
            setDescription(phase === 0 ? msg.EVEN : msg.ODD);
            if (!(await wait(0.4))) return false;

            for (let i = phase; i < n - 1; i += 2) {
                if (!sortingRef.current) return false;

                setCompareIndices([i, i + 1]);
                setSwapIndices([]);
                countCompare();
                setDescription(msg.COMPARE);
                playSound(arr[i], 'sine', i);
                if (!(await wait(1))) return false;

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    setArray([...arr]);
                    setCompareIndices([]);
                    setSwapIndices([i, i + 1]);
                    setDescription(msg.SWAP);
                    countSwap();
                    playSound(arr[i], 'triangle', i);
                    swapped = true;
                    if (!(await wait(1))) return false;
                    setSwapIndices([]);
                }

                setCompareIndices([]);
            }
        }

    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setDisableGroupGaps?.(false);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
