
export const flashSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Find min and max
    let min = arr[0], maxIdx = 0;
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        if (arr[i] < min) min = arr[i];
        if (arr[i] > arr[maxIdx]) maxIdx = i;
        setCompareIndices([i]);
        if (!(await wait(0.1))) return false;
    }
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
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.3))) return false;
    }

    // Cumulative counts for class boundaries
    for (let i = 1; i < m; i++) l[i] += l[i - 1];

    // Phase 1: Permutation (The Flash!)
    setDescription({ text: "Flash: Permuting to classes...", type: "SWAP" });
    let count = 0;
    let j = 0;
    let k = m - 1;

    // Swap max element to front for convenience in some implementations, 
    // but here we follow the standard cycle leader approach
    [arr[0], arr[maxIdx]] = [arr[maxIdx], arr[0]];
    groups[0] = getColorForVal(arr[0], min, max, m, palette);
    groups[maxIdx] = getColorForVal(arr[maxIdx], min, max, m, palette);
    setArray([...arr]);
    setGroupIndices({ ...groups });

    while (count < n - 1) {
        if (!sortingRef.current) return false;
        while (j >= l[getClass(arr[j])]) {
            j++;
        }
        let flash = arr[j];
        if (j >= n) break; // Safety

        while (j !== l[getClass(flash)]) {
            if (!sortingRef.current) return false;
            let c = getClass(flash);
            l[c]--;
            let hold = arr[l[c]];
            arr[l[c]] = flash;
            flash = hold;

            // Visualization
            groups[l[c]] = getColorForVal(arr[l[c]], min, max, m, palette);
            setArray([...arr]);
            setGroupIndices({ ...groups });
            setSwapIndices([l[c]]);
            countSwap();
            playSound(arr[l[c]], 'triangle', l[c]);
            if (!(await wait(0.6))) return false;
            count++;
        }
    }
    setSwapIndices([]);

    // Phase 2: Final Insertion Sort (Correction)
    setDescription({ text: "Flash: Finalizing with Insertion...", type: "INFO" });
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            if (!sortingRef.current) return false;
            arr[j + 1] = arr[j];
            groups[j + 1] = getColorForVal(arr[j + 1], min, max, m, palette);
            setArray([...arr]);
            setGroupIndices({ ...groups });
            setSwapIndices([j + 1]);
            if (!(await wait(0.2))) return false;
            j--;
        }
        arr[j + 1] = key;
        groups[j + 1] = getColorForVal(key, min, max, m, palette);
        setArray([...arr]);
        setGroupIndices({ ...groups });
        if (!(await wait(0.2))) return false;
    }

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};

const getColorForVal = (val, min, max, m, palette) => {
    const c = Math.floor(((m - 1) * (val - min)) / (max - min));
    return palette[c % palette.length];
};
