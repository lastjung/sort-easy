
export const cycleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        if (!sortingRef.current) break;

        let item = arr[cycleStart];
        let pos = cycleStart;

        // Visual State: highlight the cycle start and current active item
        setGoodIndices([cycleStart]);
        setGroupIndices({}); // Remove chaotic group splitting
        setDescription({ text: `Cycle starts at index ${cycleStart}`, type: 'TARGET' });
        if (!(await wait(0.5))) break;

        // Step 1: Find the position for the initial item
        setDescription(msg.SCAN);
        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i, cycleStart]);
            setGoodIndices([cycleStart]);
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
            setSwapIndices([cycleStart, pos]);
            setGoodIndices([cycleStart, pos]);
            setDescription({ text: `Sending ${item} to index ${pos}`, type: 'SWAP' });
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
            setGoodIndices([cycleStart]);

            setDescription(msg.SCAN);
            for (let i = cycleStart + 1; i < n; i++) {
                if (!sortingRef.current) break;
                setCompareIndices([i, cycleStart]);
                setGoodIndices([cycleStart]);
                countCompare();
                playSound(arr[i], 'sine', i);
                if (arr[i] < item) pos++;
                if (!(await wait(0.4))) break;
            }
            setCompareIndices([]);

            while (item === arr[pos]) pos++;

            if (item !== arr[pos]) {
                setSwapIndices([cycleStart, pos]);
                setGoodIndices([cycleStart, pos]);
                setDescription({ text: `Rotating ${item} into index ${pos}`, type: 'SWAP' });
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
