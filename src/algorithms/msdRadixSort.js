
export const msdRadixSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    const maxVal = Math.max(...arr);
    let maxExp = 1;
    while (Math.floor(maxVal / (maxExp * 10)) > 0) maxExp *= 10;

    const groups = {};
    const getColor = (val, exp) => {
        const digit = Math.floor(val / exp) % 10;
        return palette[digit % palette.length];
    };

    const sortRange = async (start, end, exp) => {
        if (exp < 1 || start >= end || !sortingRef.current) return;

        setDescription({ text: `MSD: Partitioning by ${exp}'s Digit...`, type: "TARGET" });
        
        // Phase 0: Color the current range
        for (let i = start; i <= end; i++) {
            if (!sortingRef.current) return;
            groups[i] = getColor(arr[i], exp);
            setGroupIndices({ ...groups });
            setCompareIndices([i]);
            playSound(arr[i], 'sine', i);
            if (!(await wait(0.3))) return;
        }
        setCompareIndices([]);

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
                arr[writeIdx] = val;
                setArray([...arr]);
                
                groups[writeIdx] = getColor(val, exp);
                setGroupIndices({ ...groups });
                
                setSwapIndices([writeIdx]);
                countSwap();
                playSound(val, 'triangle', writeIdx);
                if (!(await wait(0.5))) return;
                writeIdx++;
            }
            const bucketEnd = writeIdx - 1;
            
            // Recursively sort this sub-bucket by next digit
            if (bucketStart < bucketEnd && exp > 1) {
                await sortRange(bucketStart, bucketEnd, exp / 10);
            }
        }
        setSwapIndices([]);
    };

    await sortRange(0, n - 1, maxExp);

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
