
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

        // Visual State: Start of a new cycle
        const cycleGroups = {};
        for(let k = 0; k < n; k++) {
            if (sortedIndices.includes(k)) cycleGroups[k] = palette[2]; // Sorted
            else if (k === cycleStart) cycleGroups[k] = palette[3]; // Current Cycle Start
            else cycleGroups[k] = palette[1]; // Unsorted/Scanning
        }
        setGroupIndices(cycleGroups);
        setGoodIndices([cycleStart]);
        setDescription({ text: `New Cycle starting at ${cycleStart}`, type: 'TARGET' });
        if (!(await wait(1))) break;

        // Step 1: Find the position for the initial item
        setDescription(msg.SCAN);
        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, cycleStart]);
            countCompare();
            playSound(200 + arr[i] * 5, 'sine');
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
            setSwapIndices([pos, cycleStart]);
            setDescription(msg.PLACE);
            playSound(100 + item * 5, 'sawtooth');
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
                playSound(200 + arr[i] * 5, 'sine');
                if (arr[i] < item) pos++;
                if (!(await wait(0.4))) break;
            }
            setCompareIndices([]);

            while (item === arr[pos]) pos++;

            if (item !== arr[pos]) {
                setSwapIndices([pos, cycleStart]);
                setDescription(msg.PLACE);
                playSound(100 + item * 5, 'sawtooth');
                countSwap();
                [arr[pos], item] = [item, arr[pos]];
                setArray([...arr]);
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }

        sortedIndices.push(cycleStart);
        setSortedIndices([...sortedIndices]);
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
