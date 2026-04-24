
export const strandSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    let arr = [...array];
    let n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Phase 0: Classification (Divide into 6 Distinct Strands/Color Groups)
    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const range = maxVal - minVal + 1;
    const getColor = (val) => {
        // 6 clusters to show broad trends in extracted strands
        const groupIdx = Math.floor(((val - minVal) / range) * 6);
        return palette[Math.min(groupIdx, 5)];
    };

    const groups = {};
    for (let i = 0; i < n; i++) {
        groups[i] = getColor(arr[i]);
        setGroupIndices({ ...groups });
        setCompareIndices([i]);
        setGoodIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.2))) return false;
    }
    setCompareIndices([]);
    setGoodIndices([]);

    let sortedList = [];
    let unsortedList = [...arr];

    setDescription({ text: "Strand: Extracting strands...", type: "TARGET" });

    while (unsortedList.length > 0) {
        if (!sortingRef.current) return false;
        
        let strand = [];
        let remaining = [];
        
        // Pick the first item
        strand.push(unsortedList[0]);
        let lastVal = unsortedList[0];
        
        // Highlight the start of a strand
        setGoodIndices([sortedList.length]);
        setDescription({ text: `Extracting strand from ${unsortedList.length} remaining items...`, type: "TARGET" });
        if (!(await wait(0.3))) return false;
        
        for (let i = 1; i < unsortedList.length; i++) {
            if (!sortingRef.current) return false;
            
            const candidateIdx = sortedList.length + i;
            const strandIndices = strand.map((_, idx) => sortedList.length + idx);
            const previewGroups = {};
            for (let idx = 0; idx < sortedList.length; idx++) {
                previewGroups[idx] = palette[2];
            }
            for (let idx = 0; idx < unsortedList.length; idx++) {
                const globalIdx = sortedList.length + idx;
                previewGroups[globalIdx] = idx < i ? palette[5] : getColor(unsortedList[idx]);
            }
            strandIndices.forEach((idx) => {
                previewGroups[idx] = palette[0];
            });
            previewGroups[candidateIdx] = palette[3];
            setGroupIndices(previewGroups);
            setCompareIndices([sortedList.length + strand.length - 1, candidateIdx]);
            setGoodIndices(strandIndices);
            countCompare();
            
            if (unsortedList[i] >= lastVal) {
                strand.push(unsortedList[i]);
                lastVal = unsortedList[i];
                setDescription({ text: `Accepted ${unsortedList[i]} into current strand`, type: "TARGET" });
                playSound(unsortedList[i], 'triangle', candidateIdx);
            } else {
                remaining.push(unsortedList[i]);
                setDescription({ text: `Skipped ${unsortedList[i]} for a later strand`, type: "COMPARE" });
                playSound(unsortedList[i], 'sine', candidateIdx);
            }
            if (!(await wait(0.25))) return false;
        }

        // Merge strand into sortedList
        setDescription({ text: `Merging Strand of size ${strand.length}...`, type: "SWAP" });
        const merged = [];
        let sPtr = 0, dPtr = 0;
        
        while (sPtr < strand.length || dPtr < sortedList.length) {
            if (sPtr < strand.length && (dPtr === sortedList.length || strand[sPtr] <= sortedList[dPtr])) {
                merged.push(strand[sPtr++]);
            } else {
                merged.push(sortedList[dPtr++]);
            }
        }
        
        sortedList = merged;
        unsortedList = remaining;

        // Update the main array for visualization
        const combined = [...sortedList, ...unsortedList];
        for (let i = 0; i < n; i++) {
            arr[i] = combined[i];
            groups[i] = getColor(arr[i]);
        }
        
        setArray([...arr]);
        setGroupIndices({ ...groups });
        setSortedIndices([...Array(sortedList.length).keys()]);
        setSwapIndices(strand.map((_, idx) => idx));
        countSwap();
        if (strand.length > 0) playSound(strand[0], 'triangle', 0);
        if (!(await wait(0.8))) return false;
        
        setSwapIndices([]);
        setCompareIndices([]);
        setGoodIndices([]);
    }

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
