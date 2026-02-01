
export const insertionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]); 
    setGoodIndices([1]);
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        setGoodIndices([i]); 
        setDescription(`Largest Founded`);
        if (!(await wait(1.2))) break; 
        
        let j = i - 1;
        while (j >= 0) {
            if (!sortingRef.current) break;
            setCompareIndices([j, j + 1]);
            countCompare();
            setDescription(`Comparing Two Bars`);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1.5))) break;
            
            if (arr[j] > arr[j + 1]) {
                setCompareIndices([]); setSwapIndices([j, j + 1]);
                setDescription(`Swap Bars`);
                playSound(150, 'sawtooth');
                countSwap();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                if (!(await wait(1.5))) break;
                setSwapIndices([]); 
                j--;
            } else { 
                setDescription(`Position ${j + 2} is the correct spot for insertion.`); 
                break; 
            }
        }
        if (!sortingRef.current) break;
        setCompareIndices([]); setSwapIndices([]);
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription(`Position ${i + 1} sorted. Preparing position ${i + 2} (Purple-Purple).`);
            if (!(await wait(1))) break;
        }
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        if (i + 1 < n) { 
            setGoodIndices([i + 1]); 
            setDescription(`Sorted positions: 1 to ${i + 1}. Waiting for next target.`); 
            if (!(await wait(1))) break; 
        } else { 
            setGoodIndices([]); 
        }
        playSound(600, 'square');
    }
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription("Insertion Sort Completed!");
    return true;
};
