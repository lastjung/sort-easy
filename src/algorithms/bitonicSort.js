
export const bitonicSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    const paintGroups = (groupCount) => {
        const groups = {};
        const blockSize = Math.ceil(n / groupCount);
        for (let i = 0; i < n; i++) {
            const groupIdx = Math.floor(i / blockSize);
            groups[i] = palette[groupIdx % palette.length];
        }
        setGroupIndices(groups);
    };

    const bitonicMerge = async (low, cnt, dir) => {
        if (cnt > 1) {
            const k = Math.floor(cnt / 2);
            for (let i = low; i < low + k; i++) {
                if (!sortingRef.current) return;

                const i2 = i + k;
                
                // Only visualize if within array bounds
                if (i < n && i2 < n) {
                    // Update coloring to reflect the current merge groups
                    paintGroups(Math.max(2, Math.floor(n / k) * 2));

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
        if (cnt > 1) {
            const k = Math.floor(cnt / 2);
            // Sort in ascending order
            await bitonicSortRecursive(low, k, true);
            // Sort in descending order
            await bitonicSortRecursive(low + k, k, false);
            // Merge the whole sequence in dir order
            await bitonicMerge(low, cnt, dir);
        }
    };

    // To handle non-power-of-2, we find the next power of 2 for the logic
    const nextPowerOfTwo = (v) => {
        let p = 1;
        while (p < v) p *= 2;
        return p;
    };

    setDescription(msg.START);
    if (!(await wait(1))) return;

    await bitonicSortRecursive(0, nextPowerOfTwo(n), true);

    if (!sortingRef.current) return false;
    
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
