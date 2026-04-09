
export const bucketSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // Determine bucket count and range
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = Math.max(1, max - min + 1);
    const bucketCount = Math.min(n, 5); // 5 buckets for visual clarity
    const buckets = Array.from({ length: bucketCount }, () => []);

    // Phase 1: Distribute elements into buckets (color by bucket)
    setDisableGroupGaps(true);
    setDescription(msg.DISTRIBUTE);
    const groups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        const normalizedValue = (arr[i] - min) / range;
        const bucketIdx = Math.min(Math.floor(normalizedValue * bucketCount), bucketCount - 1);
        buckets[bucketIdx].push(arr[i]);

        // Color this element by its bucket
        groups[i] = palette[bucketIdx % palette.length];
        setGroupIndices({ ...groups });

        setCompareIndices([i]);
        countCompare();
        playSound(200 + arr[i] * 5, 'sine');
        if (!(await wait(0.5))) break;
    }
    setCompareIndices([]);
    if (!(await wait(1))) return;

    // Phase 2: Sort each bucket (insertion sort) and write back
    setDisableGroupGaps(false);
    setDescription(msg.SORT);
    if (!(await wait(1))) return;

    let idx = 0;
    for (let b = 0; b < bucketCount; b++) {
        if (!sortingRef.current) break;
        buckets[b].sort((a, b) => a - b);

        for (const val of buckets[b]) {
            if (!sortingRef.current) break;
            arr[idx] = val;
            setArray([...arr]);

            // Color by bucket with gaps between buckets
            const writeGroups = {};
            let wi = 0;
            for (let bi = 0; bi <= b; bi++) {
                for (let bj = 0; bj < buckets[bi].length; bj++) {
                    if (wi < n) {
                        writeGroups[wi] = palette[bi % palette.length];
                        wi++;
                    }
                }
            }
            setGroupIndices({ ...writeGroups });

            setSwapIndices([idx]);
            countSwap();
            playSound(100 + val * 5, 'sawtooth');
            if (!(await wait(1))) break;
            setSwapIndices([]);
            idx++;
        }
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
