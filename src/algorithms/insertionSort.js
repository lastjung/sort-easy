
export const insertionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]); 
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        setGoodIndices([i]); 
        setDescription(msg.PICK);
        if (!(await wait(1.5))) break; // Setup 1.5
        
        let j = i - 1;
        while (j >= 0) {
            if (!sortingRef.current) break;
            setCompareIndices([j, j + 1]);
            countCompare();
            setDescription(msg.COMPARE);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break; // Compare 1.0
            
            if (arr[j] > arr[j + 1]) {
                setCompareIndices([]); setSwapIndices([j, j + 1]);
                setDescription(msg.SHIFT);
                playSound(150, 'sawtooth');
                countSwap();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                if (!(await wait(1))) break; // Action 1.0
                setSwapIndices([]); 
                j--;
            } else { 
                setDescription(msg.INSERT); 
                break; 
            }
        }
        if (!sortingRef.current) break;
        setCompareIndices([]); setSwapIndices([]);
        
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        
        if (i + 1 < n) { 
            setGoodIndices([i + 1]); 
            if (!(await wait(1))) break; 
        } else { 
            setGoodIndices([]); 
        }
        playSound(600, 'square');
    }
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription(msg.FINISHED);
    return true;
};
