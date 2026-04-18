
export const bucketSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // Determine bucket count and range
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = Math.max(1, max - min + 1);
    const bucketCount = Math.min(n, 5); // 5 buckets for visual clarity
    const buckets = Array.from({ length: bucketCount }, () => []);

    // Helper to get color for a value
    const getColor = (val) => {
        const normalizedValue = (val - min) / range;
        const bucketIdx = Math.min(Math.floor(normalizedValue * bucketCount), bucketCount - 1);
        return palette[bucketIdx % palette.length];
    };

    setDisableGroupGaps(true);
    setGroupIndices({});
    setDescription({ text: "Classifying Elements...", type: "TARGET" });

    // Phase 0: Classification Scan (One-by-one coloring)
    const groups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        groups[i] = getColor(arr[i]);
        setGroupIndices({ ...groups });
        setCompareIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.5))) break; // Synced scan speed
    }
    setCompareIndices([]);
    if (!(await wait(1))) return;

    // Phase 1: Distribute elements into buckets
    setDescription(msg.DISTRIBUTE);
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        const bucketIdx = Math.min(Math.floor(((arr[i] - min) / range) * bucketCount), bucketCount - 1);
        buckets[bucketIdx].push(arr[i]);

        setCompareIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.5))) break;
    }
    setCompareIndices([]);
    if (!(await wait(1))) return;

    // Phase 2: Sort each bucket and write back (Visualized)
    setDescription(msg.SORT);
    if (!(await wait(1))) return;

    let currentIdx = 0;

    for (let b = 0; b < bucketCount; b++) {
        if (!sortingRef.current) break;
        
        const bucketStart = currentIdx;
        
        // 1. Gather elements from bucket to main array
        for (const val of buckets[b]) {
            if (!sortingRef.current) break;
            arr[currentIdx] = val;
            
            // Update the color at current index based on the NEW value
            groups[currentIdx] = getColor(val);
            setGroupIndices({ ...groups });
            setArray([...arr]);

            setSwapIndices([currentIdx]);
            countSwap();
            playSound(val, 'triangle', currentIdx);
            if (!(await wait(1))) break;
            setSwapIndices([]);
            currentIdx++;
        }
        const bucketEnd = currentIdx - 1;

        // 2. Internal Sort within the bucket range
        if (bucketStart < bucketEnd) {
            setDescription({ text: `Sorting Bucket ${b + 1}...`, type: 'TARGET' });
            for (let i = bucketStart + 1; i <= bucketEnd; i++) {
                if (!sortingRef.current) break;
                let key = arr[i];
                let j = i - 1;

                setCompareIndices([i]);
                if (!(await wait(0.5))) break;

                while (j >= bucketStart && arr[j] > key) {
                    if (!sortingRef.current) break;
                    
                    setCompareIndices([j, j + 1]);
                    countCompare();
                    
                    arr[j + 1] = arr[j];
                    groups[j + 1] = getColor(arr[j + 1]);
                    setGroupIndices({ ...groups });
                    setArray([...arr]);
                    
                    setSwapIndices([j + 1]);
                    countSwap();
                    playSound(arr[j + 1], 'sine', j + 1);
                    
                    if (!(await wait(0.5))) break;
                    j--;
                }
                arr[j + 1] = key;
                groups[j + 1] = getColor(key);
                setGroupIndices({ ...groups });
                setArray([...arr]);
                
                setSwapIndices([j + 1]);
                playSound(key, 'triangle', j + 1);
                if (!(await wait(0.5))) break;
                setSwapIndices([]);
                setCompareIndices([]);
            }
        }
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
