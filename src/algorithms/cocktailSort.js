
export const cocktailSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    setSortedIndices([]);
    let start = 0, end = arr.length - 1, swapped = true;
    let sortedIndices = [];
    while (swapped) {
        swapped = false;
        setDescription(msg.FORWARD);
        if (!(await wait(1.5))) break; // Setup 1.5
        
        for (let i = start; i < end; ++i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            setDescription(msg.COMPARE);
            countCompare(); 
            if (!(await wait(1))) break; // Compare 1.0
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); 
                setDescription(msg.SWAP);
                swapped = true; 
                if (!(await wait(1))) break; // Action 1.0
                setSwapIndices([]);
            }
        }
        if (!swapped) break;
        swapped = false;
        sortedIndices.push(end);
        setSortedIndices([...sortedIndices]);
        end--;
        if (!(await wait(0.5))) break; // Outro 0.5

        setDescription(msg.BACKWARD);
        if (!(await wait(1.5))) break; // Setup 1.5
        
        for (let i = end - 1; i >= start; --i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            setDescription(msg.COMPARE);
            countCompare(); 
            if (!(await wait(1))) break; // Compare 1.0
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); 
                setDescription(msg.SWAP);
                swapped = true; 
                if (!(await wait(1))) break; // Action 1.0
                setSwapIndices([]);
            }
        }
        sortedIndices.push(start);
        setSortedIndices([...sortedIndices]);
        start++;
        if (!(await wait(0.5))) break; // Outro 0.5
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(arr.length).keys()]);
    setDescription("Cocktail Sort Completed!");
    return true;
};
