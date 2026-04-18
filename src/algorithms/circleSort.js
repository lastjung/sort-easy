
export const circleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Phase 0: Classification (Group into 4 distinct Color Quadrants)
    setDescription({ text: "Assigning 4-Quadrant Colors...", type: "TARGET" });
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    
    // Choose 4 distinct colors from the palette for clear grouping
    const quadColors = [palette[0], palette[3], palette[5], palette[8]];

    const getColor = (val) => {
        if (range <= 1) return quadColors[0];
        const quadIdx = Math.floor(((val - min) / range) * 4);
        return quadColors[Math.min(quadIdx, 3)];
    };

    const groups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        groups[i] = getColor(arr[i]);
        setGroupIndices({ ...groups });
        setCompareIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.4))) return false;
    }
    setCompareIndices([]);

    const circleSortRecursive = async (low, high, depth = 0) => {
        if (low === high || !sortingRef.current) return false;

        let swapped = false;
        let l = low;
        let h = high;

        // Visual Cues for Depth: Categorize circles by their recursion level
        const levelText = depth === 0 ? "Global Circle" : `Sub-Circle (Lev ${depth})`;
        const depthColor = palette[Math.min(depth * 3, palette.length - 1)];
        
        setDescription({ text: `${levelText} [${low}-${high}]`, type: 'INFO' });

        while (l < h) {
            if (!sortingRef.current) return false;

            // Highlight the circular pair based on depth
            setCompareIndices([l, h]);
            countCompare();
            
            // Temporary group highlight to show the "active branch"
            const rangeGroups = { ...groups };
            rangeGroups[l] = depthColor;
            rangeGroups[h] = depthColor;
            setGroupIndices(rangeGroups);
            
            playSound(arr[l], 'sine', l);
            if (!(await wait(0.6))) return false;

            if (arr[l] > arr[h]) {
                setSwapIndices([l, h]);
                countSwap();
                [arr[l], arr[h]] = [arr[h], arr[l]];
                
                // Finalize value colors after swap
                groups[l] = getColor(arr[l]);
                groups[h] = getColor(arr[h]);
                
                setArray([...arr]);
                setGroupIndices({ ...groups });
                playSound(arr[l], 'triangle', l);
                swapped = true;
                if (!(await wait(0.8))) return false;
            }
            setSwapIndices([]);
            l++;
            h--;
        }

        if (l === h && h + 1 < n) {
            if (!sortingRef.current) return false;
            setCompareIndices([l, h + 1]);
            countCompare();
            playSound(arr[l], 'sine', l);
            if (!(await wait(0.8))) return false;

            if (arr[l] > arr[h + 1]) {
                setSwapIndices([l, h + 1]);
                countSwap();
                [arr[l], arr[h + 1]] = [arr[h + 1], arr[l]];
                groups[l] = getColor(arr[l]);
                groups[h + 1] = getColor(arr[h + 1]);
                setArray([...arr]);
                setGroupIndices({ ...groups });
                playSound(arr[l], 'triangle', l);
                swapped = true;
                if (!(await wait(0.8))) return false;
            }
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

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
