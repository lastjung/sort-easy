
export const bucketSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
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
        setGoodIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.35))) break; // Synced scan speed
    }
    setCompareIndices([]);
    setGoodIndices([]);
    if (!(await wait(1))) return;

    // Phase 1: Distribute elements into buckets
    setDescription(msg.DISTRIBUTE);
    const bucketFillCounts = new Array(bucketCount).fill(0);
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        const bucketIdx = Math.min(Math.floor(((arr[i] - min) / range) * bucketCount), bucketCount - 1);
        buckets[bucketIdx].push(arr[i]);
        bucketFillCounts[bucketIdx]++;

        const bucketPreviewGroups = {};
        let writeCursor = 0;
        for (let b = 0; b < bucketCount; b++) {
            for (let c = 0; c < bucketFillCounts[b]; c++) {
                bucketPreviewGroups[writeCursor++] = palette[b % palette.length];
            }
        }

        setCompareIndices([i]);
        setGoodIndices([i]);
        setGroupIndices({ ...groups, ...bucketPreviewGroups });
        setDescription({ text: `Distributing into Bucket ${bucketIdx + 1}/${bucketCount}`, type: 'TARGET' });
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.35))) break;
    }
    setCompareIndices([]);
    setGoodIndices([]);
    setGroupIndices({ ...groups });
    if (!(await wait(1))) return;

    // Phase 2: Sort each bucket and write back (Visualized)
    setDescription(msg.SORT);
    if (!(await wait(1))) return;

    let currentIdx = 0;

    for (let b = 0; b < bucketCount; b++) {
        if (!sortingRef.current) break;
        
        const bucketStart = currentIdx;
        setDescription({ text: `Writing Bucket ${b + 1}/${bucketCount}`, type: 'TARGET' });
        
        // 1. Gather elements from bucket to main array
        for (const val of buckets[b]) {
            if (!sortingRef.current) break;
            arr[currentIdx] = val;
            
            // Update the color at current index based on the NEW value
            groups[currentIdx] = getColor(val);
            setGroupIndices({ ...groups });
            setArray([...arr]);

            setSwapIndices([currentIdx]);
            setGoodIndices([currentIdx]);
            countSwap();
            playSound(val, 'triangle', currentIdx);
            if (!(await wait(0.5))) break;
            setSwapIndices([]);
            currentIdx++;
        }
        const bucketEnd = currentIdx - 1;
        setGoodIndices(bucketStart <= bucketEnd ? [...Array(bucketEnd - bucketStart + 1).keys()].map(offset => bucketStart + offset) : []);

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
                    
                    if (!(await wait(0.35))) break;
                    j--;
                }
                arr[j + 1] = key;
                groups[j + 1] = getColor(key);
                setGroupIndices({ ...groups });
                setArray([...arr]);
                
                setSwapIndices([j + 1]);
                playSound(key, 'triangle', j + 1);
                if (!(await wait(0.35))) break;
                setSwapIndices([]);
                setCompareIndices([]);
            }
        }

        setGoodIndices([]);
        setCompareIndices([]);
        setSwapIndices([]);
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
