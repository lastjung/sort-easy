
export const msdRadixSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    const maxVal = Math.max(...arr);
    let maxExp = 1;
    while (Math.floor(maxVal / (maxExp * 10)) > 0) maxExp *= 10;
    const digitLabel = (e) => e === 1 ? "1's" : e === 10 ? "10's" : e === 100 ? "100's" : `${e}'s`;

    const groups = {};
    const getColor = (val) => {
        // ALWAYS use the most significant digit (maxExp) for consistent coloring
        const digit = Math.floor(val / maxExp) % 10;
        return palette[digit % palette.length];
    };

    const sortRange = async (start, end, exp) => {
        if (exp < 1 || start >= end || !sortingRef.current) return;

        setDescription({ text: `Scanning ${digitLabel(exp)} Digit...`, type: "TARGET" });
        
        // Phase 0: Color the current range
        for (let i = start; i <= end; i++) {
            if (!sortingRef.current) return;
            groups[i] = getColor(arr[i]);
            setGroupIndices({ ...groups });
            setCompareIndices([i]);
            setGoodIndices([i]);
            countCompare();
            playSound(arr[i], 'sine', i);
            if (!(await wait(0.5))) return;
        }
        setCompareIndices([]);
        setGoodIndices([]);

        const buckets = Array.from({ length: 10 }, () => []);
        for (let i = start; i <= end; i++) {
            const digit = Math.floor(arr[i] / exp) % 10;
            buckets[digit].push(arr[i]);
        }

        let writeIdx = start;
        for (let b = 0; b < 10; b++) {
            const bucketStart = writeIdx;
            for (const val of buckets[b]) {
                if (!sortingRef.current) return;
                setDescription({ text: `Placing by ${digitLabel(exp)} Digit...`, type: 'SWAP' });
                arr[writeIdx] = val;
                setArray([...arr]);
                
                groups[writeIdx] = getColor(val);
                setGroupIndices({ ...groups });
                
                setGoodIndices([writeIdx]);
                setSwapIndices([writeIdx]);
                countSwap();
                playSound(val, 'triangle', writeIdx);
                if (!(await wait(1.0))) return; // Synced with LSD's write-back speed
                setGoodIndices([]);
                writeIdx++;
            }
            const bucketEnd = writeIdx - 1;
            
            // Recursively sort this sub-bucket by next digit
                if (bucketStart < bucketEnd && exp > 1) {
                await sortRange(bucketStart, bucketEnd, exp / 10);
            }
        }
        setSwapIndices([]);
        setCompareIndices([]);
        setGoodIndices([]);
        if (sortingRef.current) {
            setDescription({ text: `${digitLabel(exp)} Digit Sorted!`, type: 'SUCCESS' });
            if (!(await wait(2))) return;
        }
    };

    await sortRange(0, n - 1, maxExp);

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
