
export const shellSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]);
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        setDescription(`Starting pass with Gap size ${gap}.`);
        if (!(await wait(1.5))) break;
        for (let i = gap; i < n; i++) {
            if (!sortingRef.current) break;
            let temp = arr[i];
            let j = i;
            setGoodIndices([i]);
            while (j >= gap && arr[j - gap] > temp) {
                setCompareIndices([j, j - gap]);
                countCompare();
                setDescription(`Comparing Two Bars`);
                if (!(await wait(1))) break;
                arr[j] = arr[j - gap];
                countSwap();
                setArray([...arr]);
                setSwapIndices([j, j - gap]);
                if (!(await wait(1))) break;
                j -= gap;
            }
            arr[j] = temp;
            countSwap();
            setArray([...arr]);
            setSwapIndices([j]);
            if (!(await wait(1))) break;
        }
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription("Shell Sort Completed!");
    return true;
};
