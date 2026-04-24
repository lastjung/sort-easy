
export const flashSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
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
    if (!(await wait(1))) return false;

    // Find min and max
    let min = arr[0], maxIdx = 0;
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        if (arr[i] < min) min = arr[i];
        if (arr[i] > arr[maxIdx]) maxIdx = i;
        setCompareIndices([i]);
        setGoodIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.1))) return false;
    }
    setCompareIndices([]);
    setGoodIndices([]);
    const max = arr[maxIdx];

    if (min === max) {
        setSortedIndices([...Array(n).keys()]);
        return true;
    }

    // Number of classes
    const m = Math.floor(0.45 * n) || 1;
    const l = new Array(m).fill(0);

    const getClass = (val) => Math.floor(((m - 1) * (val - min)) / (max - min));

    // Phase 0: Classification Scan
    setDescription({ text: "Flash: Classifying elements...", type: "TARGET" });
    const groups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        const c = getClass(arr[i]);
        l[c]++;
        groups[i] = palette[c % palette.length];
        setGroupIndices({ ...groups });
        setCompareIndices([i]);
        setGoodIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.3))) return false;
    }
    setCompareIndices([]);
    setGoodIndices([]);

    // Cumulative counts for class boundaries
    for (let i = 1; i < m; i++) l[i] += l[i - 1];

    // Phase 1: Permutation (The Flash!)
    // Use the class partition directly for a stable, safe flash distribution.
    setDescription({ text: "Flash: Permuting to classes...", type: "SWAP" });
    const buckets = Array.from({ length: m }, () => []);
    for (let i = 0; i < n; i++) {
        buckets[getClass(arr[i])].push(arr[i]);
    }

    let writeIdx = 0;
    for (let c = 0; c < m; c++) {
        setDescription({ text: `Flash Class ${c + 1}/${m}`, type: "TARGET" });
        for (const val of buckets[c]) {
            if (!sortingRef.current) return false;
            arr[writeIdx] = val;
            groups[writeIdx] = getColorForVal(val, min, max, m, palette);
            setArray([...arr]);
            setGroupIndices({ ...groups });
            setGoodIndices([writeIdx]);
            setSwapIndices([writeIdx]);
            countSwap();
            playSound(val, 'triangle', writeIdx);
            if (!(await wait(0.35))) return false;
            setSwapIndices([]);
            setGoodIndices([]);
            writeIdx++;
        }
    }
    setCompareIndices([]);
    setGoodIndices([]);

    // Phase 2: Final Insertion Sort (Correction)
    setDescription({ text: "Flash: Finalizing with Insertion...", type: "INFO" });
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            if (!sortingRef.current) return false;
            setCompareIndices([j, j + 1]);
            countCompare();
            arr[j + 1] = arr[j];
            groups[j + 1] = getColorForVal(arr[j + 1], min, max, m, palette);
            setArray([...arr]);
            setGroupIndices({ ...groups });
            setGoodIndices([j + 1]);
            setSwapIndices([j + 1]);
            if (!(await wait(0.2))) return false;
            j--;
        }
        arr[j + 1] = key;
        groups[j + 1] = getColorForVal(key, min, max, m, palette);
        setArray([...arr]);
        setGroupIndices({ ...groups });
        setSortedIndices([...Array(i).keys()]);
        setGoodIndices([j + 1]);
        setSwapIndices([j + 1]);
        if (!(await wait(0.2))) return false;
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

const getColorForVal = (val, min, max, m, palette) => {
    const c = Math.floor(((m - 1) * (val - min)) / (max - min));
    return palette[c % palette.length];
};
