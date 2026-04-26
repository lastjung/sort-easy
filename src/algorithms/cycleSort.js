export const cycleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const COMPARE_WAIT = 1;
    const SETTLED_COMPARE_WAIT = 0.5;
    const SWAP_WAIT = 1;
    const CLOSE_WAIT = 0.35;
    let sortedIndices = [];
    const sortedColor = COLORS.SORTED;
    const smallerColor = 'bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]';
    const largerColor = 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]';

    const buildGroups = (cycleStart, smallers = new Set()) => {
        const groups = {};
        for (let k = 0; k < n; k++) {
            if (sortedIndices.includes(k) || k < cycleStart) {
                groups[k] = sortedColor;
            } else if (smallers.has(k)) {
                groups[k] = smallerColor;
            } else {
                groups[k] = largerColor;
            }
        }
        return groups;
    };

    const markSorted = (idx) => {
        if (idx >= 0 && idx < n && !sortedIndices.includes(idx)) {
            sortedIndices.push(idx);
            setSortedIndices([...sortedIndices]);
        }
    };

    const isVisuallySettled = (idx, cycleStart) => (
        sortedIndices.includes(idx) || idx < cycleStart
    );

    const renderCycleState = (cycleStart, carriedItem) => {
        const visualArr = [...arr];
        if (cycleStart >= 0 && cycleStart < n) {
            visualArr[cycleStart] = carriedItem;
        }
        setArray(visualArr);
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
        
        // Step 1: Count smaller elements
        setGoodIndices([cycleStart]);
        setGroupIndices(buildGroups(cycleStart, smallerIndices, largerIndices));
        setDescription({ text: `Counting smaller values for ${item}`, type: 'COMPARE' });

        for (let i = cycleStart + 1; i < n; i++) {
            if (!sortingRef.current) break;
            const shouldAnimateCompare = !isVisuallySettled(i, cycleStart);
            countCompare();
            if (shouldAnimateCompare) {
                setCompareIndices([i]);
                playSound(arr[i], 'sine', i);
            } else {
                setCompareIndices([]);
            }
            if (arr[i] < item) {
                pos++;
                smallerIndices.add(i);
            } else {
                largerIndices.add(i);
            }
            setGroupIndices(buildGroups(cycleStart, smallerIndices, largerIndices));
            if (!(await wait(shouldAnimateCompare ? COMPARE_WAIT : SETTLED_COMPARE_WAIT))) break;
        }

        setCompareIndices([]);

        if (pos === cycleStart) {
            markSorted(cycleStart);
            setGoodIndices([]);
            continue;
        }

        // Handle duplicates: skip same values
        while (pos < n && item === arr[pos]) pos++;

        if (pos < n && pos !== cycleStart) {
            setSwapIndices([cycleStart, pos]);
            setGoodIndices([cycleStart, pos]);
            setDescription({ text: `Placing ${item} at index ${pos}`, type: 'SWAP' });
            playSound(item, 'triangle', pos);
            countSwap();
            
            [arr[pos], item] = [item, arr[pos]];
            
            markSorted(pos);
            renderCycleState(cycleStart, item);
            if (!(await wait(SWAP_WAIT))) break;
            setSwapIndices([]);
        }

        // Step 2: Cycle rotations
        let safetyCounter = 0;
        const MAX_CYCLES = n * 2; // Safety break

        while (pos !== cycleStart && safetyCounter < MAX_CYCLES) {
            safetyCounter++;
            if (!sortingRef.current) break;
            pos = cycleStart;
            smallerIndices.clear();
            largerIndices.clear();
            
            setGoodIndices([cycleStart]);
            setGroupIndices(buildGroups(cycleStart, smallerIndices, largerIndices));
            setDescription({ text: `Finding home for value ${item}`, type: 'COMPARE' });

            for (let i = cycleStart + 1; i < n; i++) {
                if (!sortingRef.current) break;
                const shouldAnimateCompare = !isVisuallySettled(i, cycleStart);
                countCompare();
                if (shouldAnimateCompare) {
                    setCompareIndices([i]);
                    playSound(arr[i], 'sine', i);
                } else {
                    setCompareIndices([]);
                }
                if (arr[i] < item) {
                    pos++;
                    smallerIndices.add(i);
                } else {
                    largerIndices.add(i);
                }
                setGroupIndices(buildGroups(cycleStart, smallerIndices, largerIndices));
                const compareWait = shouldAnimateCompare
                    ? COMPARE_WAIT
                    : SETTLED_COMPARE_WAIT;
                if (!(await wait(compareWait))) break;
            }

            while (pos < n && item === arr[pos]) pos++;

            if (pos < n && pos !== cycleStart && item !== arr[pos]) {
                setCompareIndices([]);
                setSwapIndices([cycleStart, pos]);
                setGoodIndices([cycleStart, pos]);
                setDescription({ text: `Rotating ${item} into index ${pos}`, type: 'SWAP' });
                playSound(item, 'triangle', pos);
                countSwap();
                
                [arr[pos], item] = [item, arr[pos]];
                
                markSorted(pos);
                renderCycleState(cycleStart, item);
                if (!(await wait(SWAP_WAIT))) break;
                setSwapIndices([]);
            } else if (pos === cycleStart) {
                setCompareIndices([]);
                setSwapIndices([cycleStart]);
                setGoodIndices([cycleStart]);
                setDescription({ text: `Closing cycle with ${item}`, type: 'SWAP' });
                playSound(item, 'triangle', cycleStart);
                countSwap();
                arr[cycleStart] = item;
                setArray([...arr]);
                if (!(await wait(CLOSE_WAIT))) break;
                setSwapIndices([]);
                break;
            } else {
                // Something is wrong or duplicate found its home
                break;
            }
        }

        markSorted(cycleStart);
        setGoodIndices([]);
        setCompareIndices([]);
        setSwapIndices([]);
    }

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setDisableGroupGaps?.(false);
    setDescription(msg.FINISHED);
    return true;
};
