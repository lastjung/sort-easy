
export const bubbleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]); 
    let newSortedIndices = []; 
  
    setDescription("Starting Bubble Sort...");
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n - 1; i++) {
        if (!sortingRef.current) break;
  
        let swapped = false;
        const lastIdx = n - i - 1;
  
        for (let j = 0; j < lastIdx; j++) {
            if (!sortingRef.current) break;
            
            // 1. Compare (Yellow)
            setCompareIndices([j, j + 1]);
            setSwapIndices([]);
            countCompare();
            setDescription(`Comparing position ${j + 1} and ${j + 2}... (Yellow)`);
            playSound(200 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;
  
            if (arr[j] > arr[j + 1]) {
                // 2. Swap (Red)
                setCompareIndices([]); 
                setSwapIndices([j, j + 1]); 
                setDescription(`Position ${j + 1} is larger. Swapping! (Red)`);
                playSound(100 + arr[j] * 5, 'sawtooth');
                
                countSwap();
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                
                setArray([...arr]); 
                swapped = true;
                if (!(await wait(1))) break;
                setSwapIndices([]);
            } else {
                setDescription(`Position ${j + 1} is smaller or equal. Skip.`);
                if (!(await wait(1))) break;
            }
        }
        
        if (!sortingRef.current) break;
        
        // --- Baton Touch ---
        setGoodIndices([lastIdx]);
        setDescription(`The largest value reached position ${lastIdx + 1} (Purple).`);
        if (!(await wait(1))) break;

        // Confirm Sorted (Green)
        newSortedIndices.push(lastIdx);
        setSortedIndices([...newSortedIndices]);
        setGoodIndices([]);
        
        playSound(600, 'square');
        if (!swapped) {
            const remaining = [];
            for(let k=0; k < lastIdx; k++) remaining.push(k);
            setSortedIndices([...newSortedIndices, ...remaining]);
            break;
        }
    }
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription("Bubble Sort Completed!");
    return true;
};
