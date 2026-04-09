
export const bitonicSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    const { COLORS } = await import('../constants/colors');
    // Use non-green colors only (green = fully confirmed, not for local blocks)
    const blockPalette = [COLORS.GROUP_PALETTE[1], COLORS.GROUP_PALETTE[3]]; // pink, orange

    // Track completed sorted blocks for visualization
    const completedBlocks = [];

    const paintCompletedBlocks = () => {
        const groups = {};
        const sortedBlocks = [...completedBlocks].sort((a, b) => a.low - b.low);

        for (let b = 0; b < sortedBlocks.length; b++) {
            const { low, cnt } = sortedBlocks[b];
            const color = blockPalette[b % blockPalette.length];
            for (let i = low; i < Math.min(low + cnt, n); i++) {
                groups[i] = color;
            }
        }
        setGroupIndices(groups);
    };

    // Remove all sub-blocks contained within [low, low+cnt)
    const clearBlocksInRange = (low, cnt) => {
        for (let i = completedBlocks.length - 1; i >= 0; i--) {
            const b = completedBlocks[i];
            if (b.low >= low && b.low + b.cnt <= low + cnt) {
                completedBlocks.splice(i, 1);
            }
        }
    };

    setGroupIndices({});
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    const bitonicMerge = async (low, cnt, dir) => {
        if (cnt > 1) {
            const k = cnt / 2;

            for (let i = low; i < low + k; i++) {
                if (!sortingRef.current) return;

                const i2 = i + k;

                // Crucial for non-power-of-2: Only swap if both indices are in range.
                // This is equivalent to treating virtual elements as Infinity 
                // that always stay in the virtual zone.
                if (i2 < n) {
                    // 1. Compare
                    setCompareIndices([i, i2]);
                    setSwapIndices([]);
                    countCompare();
                    setDescription(msg.COMPARE);
                    playSound(200 + arr[i] * 5, 'sine');
                    if (!(await wait(1))) return;

                    if ((dir && arr[i] > arr[i2]) || (!dir && arr[i] < arr[i2])) {
                        // 2. Swap
                        setCompareIndices([]);
                        setSwapIndices([i, i2]);
                        setDescription(msg.SWAP);
                        playSound(100 + arr[i] * 5, 'sawtooth');

                        countSwap();
                        [arr[i], arr[i2]] = [arr[i2], arr[i]];
                        setArray([...arr]);
                        if (!(await wait(1))) return;
                        setSwapIndices([]);
                    }
                }
            }
            await bitonicMerge(low, k, dir);
            await bitonicMerge(low + k, k, dir);
        }
    };

    const bitonicSortRecursive = async (low, cnt, dir) => {
        if (!sortingRef.current) return;
        if (cnt > 1) {
            const k = cnt / 2;
            
            // Create a bitonic sequence: 
            // First half opposite, second half target direction
            await bitonicSortRecursive(low, k, !dir);
            await bitonicSortRecursive(low + k, k, dir);

            if (!sortingRef.current) return;

            clearBlocksInRange(low, cnt);
            paintCompletedBlocks();

            await bitonicMerge(low, cnt, dir);

            const actualCnt = Math.min(cnt, n - low);
            if (actualCnt > 0) {
                completedBlocks.push({ low, cnt: actualCnt });
                setCompareIndices([]);
                setSwapIndices([]);
                paintCompletedBlocks();
            }
        }
    };

    const nextPowerOfTwo = (v) => {
        let p = 1;
        while (p < v) p *= 2;
        return p;
    };

    await bitonicSortRecursive(0, nextPowerOfTwo(n), true);

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
