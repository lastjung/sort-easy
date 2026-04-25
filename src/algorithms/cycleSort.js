
export const cycleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];
    const sortedColor = 'bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.5)]';
    const smallerColor = 'bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]';
    const largerColor = 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]';

    const buildGroups = (cycleStart, smallers = new Set(), largers = new Set()) => {
        const groups = {};
        for (let k = 0; k < n; k++) {
            if (k < cycleStart) {
                groups[k] = sortedColor;
            } else if (smallers.has(k)) {
                groups[k] = smallerColor;
            } else if (largers.has(k)) {
                groups[k] = largerColor;
            } else {
                groups[k] = largerColor;
            }
        }
        return groups;
    };

    const markSorted = (idx) => {
        if (!sortedIndices.includes(idx)) {
            sortedIndices.push(idx);
            setSortedIndices([...sortedIndices]);
        }
    };

    setDisableGroupGaps?.(true);
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
        const smallerIndices = new Set();
        const largerIndices = new Set();
        let divideGroups = buildGroups(cycleStart, smallerIndices, largerIndices);

        // Visual State: highlight the cycle start and current active item
        setGoodIndices([cycleStart]);
        setGroupIndices(divideGroups);
        setDescription({ text: `Cycle starts at index ${cycleStart}`, type: 'TARGET' });
        if (!(await wait(1.0))) break;

        // Step 1: Find the position for the initial item
        setDescription({ text: `Counting smaller values for ${item}`, type: 'COMPARE' });
        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i]);
            setGoodIndices([cycleStart]);
            countCompare();
            playSound(arr[i], 'sine', i);
            if (arr[i] < item) {
                pos++;
                smallerIndices.add(i);
            } else {
                largerIndices.add(i);
            }
            divideGroups = buildGroups(cycleStart, smallerIndices, largerIndices);
            setGroupIndices(divideGroups);
            if (!(await wait(1.0))) break;
        }
        setCompareIndices([]);
        setGroupIndices(divideGroups);

        if (pos === cycleStart) {
            markSorted(cycleStart);
            setGoodIndices([]);
            continue;
        }

        // Handle duplicates
        while (item === arr[pos]) pos++;

        setCompareIndices([]);
        setGoodIndices([cycleStart, pos]);
        setDescription({ text: `${item} belongs at index ${pos}`, type: 'TARGET' });
        if (!(await wait(1.0))) break;

        // Initial Placement
        if (pos !== cycleStart) {
            setSwapIndices([cycleStart, pos]);
            setGoodIndices([cycleStart, pos]);
            setDescription({ text: `Sending ${item} to index ${pos}`, type: 'SWAP' });
            playSound(item, 'triangle', pos);
            countSwap();
            [arr[pos], item] = [item, arr[pos]];
            setArray([...arr]);
            if (!(await wait(1.0))) break;
            markSorted(pos);
            setSwapIndices([]);
        }

        // Step 2: Rotate the rest of the elements in the cycle
        while (pos !== cycleStart) {
            if (!sortingRef.current) break;
            pos = cycleStart;
            smallerIndices.clear();
            largerIndices.clear();
            divideGroups = buildGroups(cycleStart, smallerIndices, largerIndices);
            setGoodIndices([cycleStart]);
            setGroupIndices(divideGroups);

            setDescription({ text: `Finding next home for carried value ${item}`, type: 'COMPARE' });
            for (let i = cycleStart + 1; i < n; i++) {
                if (!sortingRef.current) break;
                setCompareIndices([i]);
                setGoodIndices([cycleStart]);
                countCompare();
                playSound(arr[i], 'sine', i);
                if (arr[i] < item) {
                    pos++;
                    smallerIndices.add(i);
                } else {
                    largerIndices.add(i);
                }
                divideGroups = buildGroups(cycleStart, smallerIndices, largerIndices);
                setGroupIndices(divideGroups);
                if (!(await wait(1.0))) break;
            }
            setCompareIndices([]);
            setGroupIndices(divideGroups);

            while (item === arr[pos]) pos++;

            setGoodIndices([cycleStart, pos]);
            setDescription({ text: `Rotate ${item} into index ${pos}`, type: 'TARGET' });
            if (!(await wait(1.0))) break;

            if (item !== arr[pos]) {
                setSwapIndices([cycleStart, pos]);
                setGoodIndices([cycleStart, pos]);
                setDescription({ text: `Rotating ${item} into index ${pos}`, type: 'SWAP' });
                playSound(item, 'triangle', pos);
                countSwap();
                [arr[pos], item] = [item, arr[pos]];
                setArray([...arr]);
                if (!(await wait(1.0))) break;
                markSorted(pos);
                setSwapIndices([]);
            }
        }

        markSorted(cycleStart);
        setGoodIndices([]);
        setCompareIndices([]);
        setSwapIndices([]);
    }

    if (!sortingRef.current) {
        setDisableGroupGaps?.(false);
        return false;
    }

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setDisableGroupGaps?.(false);
    setDescription(msg.FINISHED);
    return true;
};
