
export const cycleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        if (!sortingRef.current) break;

        let item = arr[cycleStart];
        let pos = cycleStart;

        // Visual State: Minimalist status - only highlight the current active bar
        setGoodIndices([cycleStart]);
        setGroupIndices({}); // Remove chaotic group splitting
        setDescription({ text: `Processing Cycle at ${cycleStart}`, type: 'TARGET' });
        if (!(await wait(0.5))) break;

        // Step 1: Find the position for the initial item
        setDescription(msg.SCAN);
        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, cycleStart]);
            countCompare();
            playSound(arr[i], 'sine', i);
            if (arr[i] < item) pos++;
            if (!(await wait(0.4))) break;
        }
        setCompareIndices([]);

        if (pos === cycleStart) {
            sortedIndices.push(cycleStart);
            setSortedIndices([...sortedIndices]);
            continue;
        }

        // Handle duplicates
        while (item === arr[pos]) pos++;

        // Initial Placement
        if (pos !== cycleStart) {
            setSwapIndices([pos]); // Highlight only the placement destination
            setGoodIndices([cycleStart]); // Keep source highlighted
            setDescription(msg.PLACE);
            playSound(item, 'triangle', pos);
            countSwap();
            [arr[pos], item] = [item, arr[pos]];
            setArray([...arr]);
            if (!(await wait(1))) break;
            setSwapIndices([]);
        }

        // Step 2: Rotate the rest of the elements in the cycle
        while (pos !== cycleStart) {
            if (!sortingRef.current) break;
            pos = cycleStart;

            setDescription(msg.SCAN);
            for (let i = cycleStart + 1; i < n; i++) {
                if (!sortingRef.current) break;
                setCompareIndices([i, cycleStart]);
                countCompare();
                playSound(arr[i], 'sine', i);
                if (arr[i] < item) pos++;
                if (!(await wait(0.4))) break;
            }
            setCompareIndices([]);

            while (item === arr[pos]) pos++;

            if (item !== arr[pos]) {
                setSwapIndices([pos]);
                setDescription(msg.PLACE);
                playSound(item, 'triangle', pos);
                countSwap();
                [arr[pos], item] = [item, arr[pos]];
                setArray([...arr]);
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }

        sortedIndices.push(cycleStart);
        setSortedIndices([...sortedIndices]);
        setGoodIndices([]);
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
