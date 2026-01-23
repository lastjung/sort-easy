
export const selectionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef }) => {
    const arr = [...array];
    const n = arr.length;
    let newSortedIndices = []; 
  
    setDescription("Starting Selection Sort...");
    setSortedIndices([]);
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
  
        let minIndex = i;
        // 1. Target (Purple)
        setGoodIndices([i]); 
        setDescription(`Finding the smallest value for position ${i + 1} (Purple).`);
        if (!(await wait(1.5))) break;
  
        for (let j = i + 1; j < n; j++) {
            if (!sortingRef.current) break;
  
            // 2. Scanning (Yellow)
            setCompareIndices([j]); 
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(0.5))) break;
  
            if (arr[j] < arr[minIndex]) {
                // New minimum found (Red)
                minIndex = j;
                setDescription(`New minimum found at position ${j + 1}! (Red)`); 
                setSwapIndices([minIndex]); 
                playSound(800, 'triangle'); 
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }
        
        if (!sortingRef.current) break;
        setCompareIndices([]);
  
        // 3. Action (Red)
        if (minIndex !== i) {
            setDescription(`Swapping position ${i + 1} with minimum from position ${minIndex + 1} (Red).`);
            setSwapIndices([i, minIndex]); 
            playSound(150, 'sawtooth'); 
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            setArray([...arr]);
            if (!(await wait(1.5))) break;
            setSwapIndices([]);
        } else {
             setDescription(`Position ${i + 1} already has the smallest value.`);
             if (!(await wait(1))) break;
        }
  
        // --- Baton Touch ---
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription("Confirming position and preparing next target (Purple-Purple).");
            if (!(await wait(1))) break;
        }

        // Green confirm
        newSortedIndices.push(i);
        setSortedIndices([...newSortedIndices]);
        
        if (i + 1 < n) {
            setGoodIndices([i + 1]);
            if (!(await wait(1))) break;
        } else {
            setGoodIndices([]);
        }
        
        playSound(600, 'square');
    }
    setSortedIndices([...Array(n).keys()]);
    setDescription("Selection Sort Completed!");
    return true;
};
