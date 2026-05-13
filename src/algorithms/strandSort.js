
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
        if (!(await wait(0.5))) return false;
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
        if (!(await wait(0.8))) return false;
        
        for (let i = 1; i < unsortedList.length; i++) {
            if (!sortingRef.current) return false;
            
            const candidateIdx = sortedList.length + i;
            const strandIndices = strand.map((_, idx) => sortedList.length + idx);
            const previewGroups = {};
            // Already sorted portion
            for (let idx = 0; idx < sortedList.length; idx++) {
                previewGroups[idx] = palette[2];
            }
            // Unsorted portion: keep original getColor for all, then override specific roles
            for (let idx = 0; idx < unsortedList.length; idx++) {
                const globalIdx = sortedList.length + idx;
                previewGroups[globalIdx] = getColor(unsortedList[idx]);
            }
            // Strand members highlighted distinctly
            strandIndices.forEach((idx) => {
                previewGroups[idx] = palette[0];
            });
            // Current candidate highlighted
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
            if (!(await wait(1))) return false;
        }

        // Merge strand into sortedList
        setDescription({ text: `Merging Strand of size ${strand.length}...`, type: "SWAP" });
        const merged = [];
        let sPtr = 0, dPtr = 0;
        
        while (sPtr < strand.length || dPtr < sortedList.length) {
            if (!sortingRef.current) return false;
            countCompare();

            let pickedVal;
            if (sPtr < strand.length && (dPtr === sortedList.length || strand[sPtr] <= sortedList[dPtr])) {
                pickedVal = strand[sPtr];
                sPtr++;
            } else {
                pickedVal = sortedList[dPtr];
                dPtr++;
            }
            merged.push(pickedVal);

            // Progressively rebuild display array: merged + remaining strand + remaining sorted + unsorted
            const displayArr = [...merged, ...strand.slice(sPtr), ...sortedList.slice(dPtr), ...remaining];
            for (let i = 0; i < n; i++) {
                arr[i] = displayArr[i];
            }

            // Color each section distinctly
            const mergeGroups = {};
            const mergedLen = merged.length;
            const remainStrand = strand.length - sPtr;
            const remainSorted = sortedList.length - dPtr;
            for (let i = 0; i < mergedLen; i++) mergeGroups[i] = palette[2];
            for (let i = mergedLen; i < mergedLen + remainStrand; i++) mergeGroups[i] = palette[0];
            for (let i = mergedLen + remainStrand; i < mergedLen + remainStrand + remainSorted; i++) mergeGroups[i] = palette[5];
            for (let i = mergedLen + remainStrand + remainSorted; i < n; i++) mergeGroups[i] = getColor(arr[i]);

            setArray([...arr]);
            setGroupIndices(mergeGroups);
            setSwapIndices([mergedLen - 1]);
            playSound(pickedVal, 'triangle', mergedLen - 1);
            if (!(await wait(1))) return false;
            setSwapIndices([]);
        }
        
        sortedList = merged;
        unsortedList = remaining;

        // Update groups after merge complete
        for (let i = 0; i < n; i++) {
            groups[i] = getColor(arr[i]);
        }
        setGroupIndices({ ...groups });
        setSortedIndices([...Array(sortedList.length).keys()]);
        countSwap();
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
