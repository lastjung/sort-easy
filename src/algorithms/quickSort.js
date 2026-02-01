
export const quickSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];

    const partition = async (low, high) => {
        let pivot = arr[high];
        setGoodIndices([high]); // Pivot as Purple
        setDescription(msg.PIVOT);
        if (!(await wait(1.5))) return -1;
        
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (!sortingRef.current) return -1;
            setCompareIndices([j, high]);
            countCompare();
            setDescription(msg.COMPARE);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;

            if (arr[j] < pivot) {
                i++;
                setSwapIndices([i, j]);
                setDescription(msg.SWAP);
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
        setDescription(msg.SWAP);
        countSwap();
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        if (!(await wait(1))) return -1; // Action 1.0
        setSwapIndices([]);
        
        sortedIndices.push(i + 1);
        setSortedIndices([...sortedIndices]);
        if (!(await wait(0.5))) return -1; // Outro 0.5
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

    setDescription(msg.START);
    await qSort(0, n - 1);
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
