
export const quickSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];

    const partition = async (low, high) => {
        let pivot = arr[high];
        setGoodIndices([high]); // Pivot as Purple
        setDescription(`Largest Founded`);
        if (!(await wait(1.5))) return -1;
        
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (!sortingRef.current) return -1;
            setCompareIndices([j, high]);
            countCompare();
            setDescription(`Comparing Two Bars`);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;

            if (arr[j] < pivot) {
                i++;
                setSwapIndices([i, j]);
                setDescription(`Swap Bars`);
                playSound(150, 'sawtooth');
                countSwap();
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }

        if (!sortingRef.current) return -1;
        setSwapIndices([i + 1, high]);
        setDescription(`Swap Bars`);
        countSwap();
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        if (!(await wait(1.5))) return -1;
        setSwapIndices([]);
        
        sortedIndices.push(i + 1);
        setSortedIndices([...sortedIndices]);
        return i + 1;
    };

    const qSort = async (low, high) => {
        if (low <= high) {
            let pi = await partition(low, high);
            if (pi === -1) return;
            await qSort(low, pi - 1);
            await qSort(pi + 1, high);
        }
    };

    await qSort(0, n - 1);
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription("Quick Sort Completed!");
    return true;
};
