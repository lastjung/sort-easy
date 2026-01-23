export const bubbleSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    let newSortedIndices = []; 
  
    setDescription("Starting Bubble Sort...");
    await wait(1);
  
    // Reset sorted indices
    setSortedIndices([]);
  
    for (let i = 0; i < n - 1; i++) {
        if (!sortingRef.current) break;
  
        let swapped = false;
  
        for (let j = 0; j < n - i - 1; j++) {
            if (!sortingRef.current) break;
            
            // Wait handles pause check
            if (!(await wait(0))) break; 
  
            // PHASE 1: COMPARE
            setCompareIndices([j, j + 1]);
            setSwapIndices([]);
            setGoodIndices([]);
            setDescription(`Comparing ${arr[j]} and ${arr[j + 1]}...`);
            playSound(200 + arr[j] * 5, 'sine');
            
            if (!(await wait(1))) break;
  
            if (!sortingRef.current) break;
  
            // PHASE 2: ACTION
            setCompareIndices([]); 
  
            if (arr[j] > arr[j + 1]) {
                // Swap Needed
                setDescription(`${arr[j]} > ${arr[j + 1]}. Swapping!`);
                setSwapIndices([j, j + 1]); 
                playSound(100 + arr[j] * 5, 'sawtooth');
                
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                
                setArray([...arr]); 
                swapped = true;
                if (!(await wait(1))) break;
            } else {
                // No Swap Needed
                setDescription(`${arr[j]} <= ${arr[j + 1]}. OK.`);
                setGoodIndices([j, j + 1]);
                if (!(await wait(1))) break;
            }
        }
        
        if (!sortingRef.current) break;
        
        // Mark end element as sorted
        newSortedIndices.push(n - i - 1);
        setSortedIndices([...newSortedIndices]);
        
        setCompareIndices([]);
        setSwapIndices([]);
        setGoodIndices([]);
  
        if (!swapped) {
            const remaining = [];
            for(let k=0; k < n - i - 1; k++) remaining.push(k);
            const finalSorted = [...newSortedIndices, ...remaining];
            setSortedIndices(finalSorted);
            break;
        }
    }
    return true; // Finished naturally
};
  
export const selectionSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    let newSortedIndices = []; 
  
    setDescription("Starting Selection Sort...");
    await wait(1);
  
    setSortedIndices([]);
  
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        if (!(await wait(1))) break;
  
        let minIndex = i;
        setDescription(`Target Position ${i} (Purple). Looking for smaller value...`);
        
        // 1. Highlight TARGET (Purple)
        setGoodIndices([i]); 
        setSwapIndices([]); 
        
        await wait(1);
  
        for (let j = i + 1; j < n; j++) {
            if (!sortingRef.current) break;
            if (!(await wait(0))) break;
  
            // 2. Highlight State Loop
            setGoodIndices([i]); // Keep Target Purple
            setCompareIndices([j]); // Scanner Yellow
            
            if (minIndex !== i) {
                setSwapIndices([minIndex]); // Keep explicitly found min Red
            } else {
                setSwapIndices([]); 
            }
            
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(0.5))) break;
  
            if (arr[j] < arr[minIndex]) {
                // New minimum found!
                minIndex = j;
                setDescription(`New minimum found: ${arr[j]}!`); 
                playSound(800, 'triangle'); 
                
                // 3. Mark New Min (Red)
                setCompareIndices([]); 
                setSwapIndices([minIndex]); 
                if (!(await wait(1))) break;
            }
        }
        
        if (!sortingRef.current) break;
  
        // Clear scanner
        setCompareIndices([]);
  
        // Swap phase
        if (minIndex !== i) {
            setDescription(`Swapping Target (${arr[i]}) with Min (${arr[minIndex]})`);
            
            setGoodIndices([i]);
            setSwapIndices([minIndex]); 
            
            playSound(150, 'sawtooth'); 
            
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
            
            setArray([...arr]);
            if (!(await wait(1.5))) break;
        } else {
             setDescription(`Position ${i} is correct (${arr[i]}).`);
        }
  
        // Mark i as sorted
        newSortedIndices.push(i);
        setSortedIndices([...newSortedIndices]);
        
        setSwapIndices([]);
        setGoodIndices([]);
        setCompareIndices([]);
    }
    return true;
};

export const insertionSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    
    // Initial state: 1st element is sorted (Green)
    setSortedIndices([0]);
    setDescription("Insertion Sort: Skipping the 1st element.");
    await wait(1);

    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        
        let j = i - 1;
        
        // Pick active target (Purple)
        setGoodIndices([i]); 
        setDescription(`Step ${i + 1}: Picking index ${i}.`);
        if (!(await wait(1))) break;

        // Perform "Reverse Bubbling"
        while (j >= 0) {
            if (!sortingRef.current) break;

            // 1. Compare (Yellow)
            setCompareIndices([j, j + 1]);
            setGoodIndices([]); 
            setSwapIndices([]);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(0.8))) break;

            if (arr[j] > arr[j + 1]) {
                // 2. Swap (Red)
                setCompareIndices([]);
                setSwapIndices([j, j + 1]);
                playSound(150, 'sawtooth');
                
                // Actual Swap for bubbling visual
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                
                if (!(await wait(1))) break;
                setSwapIndices([]);
                j--;
            } else {
                break;
            }
        }

        if (!sortingRef.current) break;

        // Update Sorted range (Green)
        setCompareIndices([]);
        setSwapIndices([]);
        setGoodIndices([]);
        
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        
        playSound(600, 'square');
        if (!(await wait(1))) break;
    }
    
    setSortedIndices([...Array(n).keys()]);
    return true;
};
