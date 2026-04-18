
export const pigeonholeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Phase 0: Find range and Classify (Color by value)
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    
    const getColor = (val) => {
        if (range <= 1) return palette[0];
        const idx = Math.floor(((val - min) / range) * palette.length);
        return palette[idx % palette.length];
    };

    setDescription({ text: "Checking Range & Classifying...", type: "TARGET" });
    const groups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        groups[i] = getColor(arr[i]);
        setGroupIndices({ ...groups });
        
        setCompareIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.5))) return false;
    }
    setCompareIndices([]);

    // Phase 1: Put elements into pigeonholes
    setDescription({ text: "Putting into Pigeonholes...", type: "INFO" });
    const holes = Array.from({ length: range }, () => []);
    
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        const val = arr[i];
        holes[val - min].push(val);
        
        setGoodIndices([i]);
        playSound(val, 'triangle', i);
        if (!(await wait(0.5))) return false;
    }
    setGoodIndices([]);

    // Phase 2: Gather back from holes
    setDescription({ text: "Gathering back...", type: "SWAP" });
    let writeIdx = 0;
    if (!(await wait(1))) return false;

    for (let i = 0; i < range; i++) {
        for (const val of holes[i]) {
            if (!sortingRef.current) return false;
            arr[writeIdx] = val;
            setArray([...arr]);

            // Update color in groups
            groups[writeIdx] = getColor(val);
            setGroupIndices({ ...groups });

            setSwapIndices([writeIdx]);
            countSwap();
            playSound(val, 'triangle', writeIdx);
            
            if (!(await wait(0.6))) return false;
            setSwapIndices([]);
            writeIdx++;
        }
    }

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
