
export const pancakeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [];
    const { COLORS } = await import('../constants/colors');

    setGroupIndices({});

    const flip = async (k) => {
        let left = 0;
        while (left < k) {
            if (!sortingRef.current) return;
            
            setSwapIndices([left, k]);
            countSwap();
            [arr[left], arr[k]] = [arr[k], arr[left]];
            setArray([...arr]);
            playSound(arr[left], 'triangle', left);
            if (!(await wait(1))) return;
            
            left++;
            k--;
        }
        setSwapIndices([]);
    };

    setDescription(msg.MAX);
    if (!(await wait(1))) return;

    for (let currSize = n; currSize > 1; currSize--) {
        if (!sortingRef.current) break;

        // Visual gap update (Pink: unsorted, Green: confirmed sorted)
        const groups = {};
        for (let k = 0; k < n; k++) {
            groups[k] = k < currSize ? COLORS.GROUP_PALETTE[1] : COLORS.GROUP_PALETTE[12];
        }
        setGroupIndices(groups);

        setDescription(msg.MAX);
        // Find index of maximum element in arr[0..currSize-1]
        let maxIdx = 0;
        for (let i = 1; i < currSize; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, maxIdx]);
            countCompare();
            playSound(arr[i], 'sine', i);
            if (arr[i] > arr[maxIdx]) {
                maxIdx = i;
            }
            if (!(await wait(1))) break;
        }

        if (maxIdx !== currSize - 1) {
            // Flip to bring max element to front
            if (maxIdx !== 0) {
                setDescription(msg.FLIP);
                await flip(maxIdx);
            }
            // Flip to bring max element to its correct position
            setDescription(msg.FLIP);
            await flip(currSize - 1);
        }

        // This position is now confirmed (largest element placed at the end)
        sortedIndices.push(currSize - 1);
        setSortedIndices([...sortedIndices]);
        playSound(arr[currSize - 1], 'sine', currSize - 1);
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
