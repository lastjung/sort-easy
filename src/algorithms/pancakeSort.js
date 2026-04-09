
export const pancakeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [];

    setGroupIndices({});

    const flip = async (k) => {
        let left = 0;
        while (left < k) {
            if (!sortingRef.current) return;
            
            setSwapIndices([left, k]);
            countSwap();
            [arr[left], arr[k]] = [arr[k], arr[left]];
            setArray([...arr]);
            playSound(100 + arr[left] * 5, 'sawtooth');
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

        setDescription(msg.MAX);
        // Find index of maximum element in arr[0..currSize-1]
        let maxIdx = 0;
        for (let i = 1; i < currSize; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, maxIdx]);
            countCompare();
            if (arr[i] > arr[maxIdx]) {
                maxIdx = i;
            }
            if (!(await wait(0.5))) break;
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
        playSound(600, 'square');
    }

    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
