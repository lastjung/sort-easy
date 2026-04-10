
export const heapSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    
    setSortedIndices([]);
    let sortedIndices = [];

    // --- NEW: Mapping Walkthrough Intro (Back and Forth) ---
    setDescription({ type: 'INFO', text: "Mapping walkthrough..." });
    
    // Forward: 0 -> n-1
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        setCompareIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.8))) return false; 
    }
    
    setCompareIndices([]);
    if (!(await wait(0.5))) return false; 

    const heapify = async (heapSize, i) => {
        const parent = i;
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < heapSize) {
            setCompareIndices([parent, left]);
            setDescription({ type: 'COMPARE', text: "Comparing Parent and Child" });
            countCompare();
            playSound(arr[left], 'sine', left);
            if (!(await wait(1))) return;
            setCompareIndices([]);
            if (!(await wait(0.25))) return;
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < heapSize) {
            setCompareIndices([parent, right]);
            setDescription({ type: 'COMPARE', text: "Comparing Parent and Child" });
            countCompare();
            playSound(arr[right], 'sine', right);
            if (!(await wait(1))) return;
            setCompareIndices([]);
            if (!(await wait(0.25))) return;
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            setSwapIndices([i, largest]);
            setDescription({ type: 'SWAP', text: "Swapping Nodes" });
            countSwap();
            playSound(arr[largest], 'triangle', largest);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) return;
            setSwapIndices([]);
            await heapify(heapSize, largest);
        }
    };

    // --- Phase 1: Build Max Heap ---
    setDescription({ type: 'TARGET', text: "Building Max Heap..." });
    if (!(await wait(2))) return false;

    const lastParent = Math.floor(n / 2) - 1;
    if (lastParent >= 0) {
        const maxParentDepth = Math.floor(Math.log2(lastParent + 1));
        for (let depth = maxParentDepth; depth >= 0; depth--) {
            const levelStart = Math.pow(2, depth) - 1;
            const levelEnd = Math.pow(2, depth + 1) - 2;
            for (let i = levelStart; i <= levelEnd; i++) {
                if (i > lastParent) break;
                if (!sortingRef.current) break;
                setDescription({ type: 'INFO', text: `Fixing position ${i + 1}...` });
                await heapify(n, i);
            }
            if (!sortingRef.current) break;
        }
    }
    
    setDescription({ type: 'INFO', text: "Max Heap Built! ✨" });
    if (!(await wait(2.5))) return false;

    // --- Phase 2: Actual Sorting ---
    setDescription({ type: 'TARGET', text: "Sorting: Extracting Max..." });
    if (!(await wait(2))) return false;

    for (let i = n - 1; i > 0; i--) {
        if (!sortingRef.current) break;
        
        setDescription({ type: 'SWAP', text: `Extracting Max to Position ${i + 1}` });
        if (!(await wait(1.5))) break;

        setSwapIndices([0, i]);
        countSwap();
        playSound(arr[i], 'triangle', i);
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        if (!(await wait(1.5))) break;
        
        sortedIndices.push(i);
        setSortedIndices([...sortedIndices]);
        playSound(arr[i], 'sine', i);
        setSwapIndices([]);
        
        setDescription({ type: 'INFO', text: `Restoring heap...` });
        if (!(await wait(1.5))) break;
        await heapify(i, 0);
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription({ type: 'SUCCESS', text: "Sorting Complete! ✨" });
    return true;
};
