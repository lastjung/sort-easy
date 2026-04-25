
export const circleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
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

    setGroupIndices({});
    setDisableGroupGaps(true);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Red Family for Small (Front), Blue Family for Large (Back)
    const redFamily = [palette[8], palette[1], palette[11], palette[3]];  // Rose, Pink, Orange400, Orange600
    const blueFamily = [palette[13], palette[4], palette[0], palette[9]]; // Sky, Cyan, Teal500, Teal300

    const groups = {};

    const circleSortRecursive = async (low, high, depth = 0) => {
        if (low === high || !sortingRef.current) return false;

        let swapped = false;
        let l = low;
        let h = high;

        // Visual Cues for Depth: Categorize circles by their recursion level
        const levelText = depth === 0 ? "Global Circle" : `Sub-Circle (Depth ${depth})`;
        const currentRed = redFamily[depth % redFamily.length];
        const currentBlue = blueFamily[depth % blueFamily.length];
        
        setDescription({ text: `${levelText} [${low}-${high}]`, type: 'INFO' });
        
        if (!(await wait(1.0))) return false;

        while (l < h) {
            if (!sortingRef.current) return false;

            // 1. Compare (Yellow/Scan)
            setCompareIndices([l, h]);
            setSwapIndices([]);
            countCompare();
            setDescription({ text: `${levelText}: Scanning...`, type: 'COMPARE' });
            
            playSound(arr[l], 'sine', l);
            if (!(await wait(1.0))) return false;

            if (arr[l] > arr[h]) {
                // 2. Swap (Red/Emphasis)
                setCompareIndices([]);
                setSwapIndices([l, h]);
                setDescription({ text: `${levelText}: Swapping!`, type: 'SWAP' });
                
                countSwap();
                [arr[l], arr[h]] = [arr[h], arr[l]];
                
                swapped = true;
                playSound(arr[l], 'triangle', l);
                
                // After swap: l is smaller (Red-ish), h is larger (Blue-ish)
                groups[l] = currentRed;
                groups[h] = currentBlue;
                setArray([...arr]);
                setGroupIndices({ ...groups });
                if (!(await wait(1.0))) return false;
            } else {
                // Even if no swap, color them to show small/large relationship for this depth
                groups[l] = currentRed;
                groups[h] = currentBlue;
                setGroupIndices({ ...groups });
                if (!(await wait(1.0))) return false;
            }
            
            // Cleanup indices for the next inward pair
            setCompareIndices([]);
            setSwapIndices([]);
            l++;
            h--;
        }

        // Handle middle case for odd number of elements in range
        if (l === h && h + 1 <= high) {
            if (!sortingRef.current) return false;
            setCompareIndices([l, h + 1]);
            countCompare();
            setDescription({ text: `${levelText}: Checking Center`, type: 'COMPARE' });
            playSound(arr[l], 'sine', l);
            if (!(await wait(1.0))) return false;

            if (arr[l] > arr[h + 1]) {
                setCompareIndices([]);
                setSwapIndices([l, h + 1]);
                setDescription({ text: `${levelText}: Center Swap!`, type: 'SWAP' });
                countSwap();
                [arr[l], arr[h + 1]] = [arr[h + 1], arr[l]];
                swapped = true;
                playSound(arr[l], 'triangle', l);
                groups[l] = currentRed;
                groups[h + 1] = currentBlue;
                setArray([...arr]);
                setGroupIndices({ ...groups });
                if (!(await wait(1.0))) return false;
            } else {
                groups[l] = currentRed;
                groups[h + 1] = currentBlue;
                setGroupIndices({ ...groups });
                if (!(await wait(1.0))) return false;
            }
            setCompareIndices([]);
            setSwapIndices([]);
        }

        const mid = Math.floor((high - low) / 2);
        const leftSwapped = await circleSortRecursive(low, low + mid, depth + 1);
        const rightSwapped = await circleSortRecursive(low + mid + 1, high, depth + 1);

        return swapped || leftSwapped || rightSwapped;
    };

    while (true) {
        if (!sortingRef.current) break;
        const swapped = await circleSortRecursive(0, n - 1, 0);
        if (!swapped) break;
    }

    if (!sortingRef.current) return false;

    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setDescription(msg.FINISHED);
    return true;
};
