
export const cycleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [];

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDescription(msg.START);
    if (!(await wait(1))) return;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        if (!sortingRef.current) break;

        let item = arr[cycleStart];
        let pos = cycleStart;

        // Paint: sorted region vs current vs unsorted
        const groups = {};
        for (let k = 0; k < n; k++) {
            groups[k] = k < cycleStart ? palette[0] : palette[1];
        }
        groups[cycleStart] = palette[3]; // highlight current cycle start
        setGroupIndices(groups);

        // Find the correct position for item
        setDescription(msg.SCAN);
        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, cycleStart]);
            countCompare();
            playSound(200 + arr[i] * 5, 'sine');
            if (arr[i] < item) {
                pos++;
            }
            if (!(await wait(0.5))) break;
        }
        setCompareIndices([]);

        if (pos === cycleStart) {
            // Already in correct position
            sortedIndices.push(cycleStart);
            setSortedIndices([...sortedIndices]);
            continue;
        }

        // Skip duplicates
        while (item === arr[pos]) {
            pos++;
        }

        // Place item at its correct position
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

        // Rotate the rest of the cycle
        while (pos !== cycleStart) {
            if (!sortingRef.current) break;
            pos = cycleStart;

            setDescription(msg.SCAN);
            for (let i = cycleStart + 1; i < n; i++) {
                if (!sortingRef.current) break;
                setCompareIndices([i, cycleStart]);
                countCompare();
                playSound(200 + arr[i] * 5, 'sine');
                if (arr[i] < item) {
                    pos++;
                }
                if (!(await wait(0.5))) break;
            }
            setCompareIndices([]);

            while (item === arr[pos]) {
                pos++;
            }

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

        // This cycle is complete - mark cycleStart as sorted
        sortedIndices.push(cycleStart);
        setSortedIndices([...sortedIndices]);
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
