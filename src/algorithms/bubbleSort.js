
export const bubbleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]); 
    let newSortedIndices = []; 
  
    setDescription(msg.START);
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
            setDescription(msg.COMPARE);
            playSound(200 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;
  
            if (arr[j] > arr[j + 1]) {
                // 2. Swap (Red)
                setCompareIndices([]); 
                setSwapIndices([j, j + 1]); 
                setDescription(msg.SWAP);
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
                if (!(await wait(0.5))) break;
            }
        }
        
        if (!sortingRef.current) break;
        
        if (!(await wait(1))) break;
        // Confirm Sorted (Green)
        newSortedIndices.push(lastIdx);
        setSortedIndices([...newSortedIndices]);
        setGoodIndices([]);
        
        playSound(600, 'square');
        if (!(await wait(0.5))) break; // Outro wait 0.5
        if (!swapped) {
            const remaining = [];
            for(let k=0; k < lastIdx; k++) remaining.push(k);
            setSortedIndices([...newSortedIndices, ...remaining]);
            break;
        }
    }
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
