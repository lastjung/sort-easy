
export const shellSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]);
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        setDescription(msg.GAP);
        if (!(await wait(1.5))) break; // Setup 1.5
        for (let i = gap; i < n; i++) {
            if (!sortingRef.current) break;
            let temp = arr[i];
            let j = i;
            setGoodIndices([i]);
            while (j >= gap && arr[j - gap] > temp) {
                setCompareIndices([j, j - gap]);
                countCompare();
                setDescription(msg.COMPARE);
                playSound(200 + arr[j - gap] * 5, 'sine');
                if (!(await wait(1))) break; // Compare 1.0
                arr[j] = arr[j - gap];
                countSwap();
                setArray([...arr]);
                setDescription(msg.SWAP);
                playSound(100 + arr[j] * 5, 'sawtooth');
                setSwapIndices([j, j - gap]);
                if (!(await wait(1))) break; // Action 1.0
                j -= gap;
            }
            arr[j] = temp;
            countSwap();
            setArray([...arr]);
            setSwapIndices([j]);
            playSound(600, 'square');
            if (!(await wait(1))) break; // Action 1.0
            if (!(await wait(0.5))) break; // Outro 0.5
        }
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription("Shell Sort Completed!");
    return true;
};
