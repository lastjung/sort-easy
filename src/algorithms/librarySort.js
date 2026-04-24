
export const librarySort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const originalArr = [...array];
    const n = originalArr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    const GAP_VAL = -1; // Use -1 for gaps to avoid confusion with small values
    const SHELF_COLOR = "#1a1a2e";
    
    // We use the same size 'n' but we will be very careful with space.
    // In a real Library Sort, we'd use (1+epsilon)*n, but here we stay within bounds.
    let libArr = new Array(n).fill(GAP_VAL);
    const groups = {};
    for (let i = 0; i < n; i++) groups[i] = SHELF_COLOR;

    const getColor = (val) => {
        if (val === GAP_VAL) return SHELF_COLOR;
        const minVal = Math.min(...originalArr);
        const maxVal = Math.max(...originalArr);
        const range = maxVal - minVal + 1;
        const groupIdx = Math.floor(((val - minVal) / range) * 5);
        return palette[Math.min(groupIdx, 4)];
    };

    const rebalance = async (currentItems) => {
        setDescription({ text: "Rebalancing: Spreading books evenly...", type: "SWAP" });
        const items = currentItems.filter(x => x !== GAP_VAL);
        const newLib = new Array(n).fill(GAP_VAL);
        const step = n / (items.length + 1);
        
        for (let i = 0; i < items.length; i++) {
            const newIdx = Math.floor((i + 1) * step);
            newLib[newIdx] = items[i];
        }
        
        libArr = [...newLib];
        for (let i = 0; i < n; i++) {
            groups[i] = getColor(libArr[i]);
        }
        setArray([...libArr]);
        setGroupIndices({ ...groups });
        if (!(await wait(0.8))) return false;
        return true;
    };

    // Initial item placement: show the first book moving from index 0 to the middle shelf.
    const firstTargetIdx = Math.floor(n / 2);
    setGoodIndices([0, firstTargetIdx]);
    setDescription({ text: "Opening shelf: moving first book to the center...", type: "TARGET" });
    if (!(await wait(0.4))) return false;

    setSwapIndices([0, firstTargetIdx]);
    playSound(originalArr[0], 'triangle', firstTargetIdx);
    if (!(await wait(0.4))) return false;

    libArr[firstTargetIdx] = originalArr[0];
    groups[firstTargetIdx] = getColor(originalArr[0]);
    setArray([...libArr]);
    setGroupIndices({ ...groups });
    setSwapIndices([]);
    setGoodIndices([]);
    if (!(await wait(0.5))) return false;

    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        const val = originalArr[i];
        setDescription({ text: `Finding a spot for '${val}'...`, type: "INFO" });

        // 1. Find correct insertion point (Binary-like search on non-gaps)
        let insertIdx = -1;
        let left = 0, right = n - 1;
        
        // Find the first non-gap index
        while (left < n && libArr[left] === GAP_VAL) left++;
        // Find the last non-gap index
        while (right >= 0 && libArr[right] === GAP_VAL) right--;

        if (val < libArr[left]) {
            insertIdx = left;
        } else if (val > libArr[right]) {
            insertIdx = right + 1;
        } else {
            // Linear search between existing items (skipping gaps)
            for (let j = left; j <= right; j++) {
                if (libArr[j] !== GAP_VAL) {
                    setCompareIndices([j]);
                    playSound(libArr[j], 'sine', j);
                    if (!(await wait(0.1))) return false;
                    if (libArr[j] >= val) {
                        insertIdx = j;
                        break;
                    }
                }
            }
        }
        setCompareIndices([]);

        // 2. Insert and Shift
        let placed = false;
        const shouldAppendAtEnd = insertIdx >= n;
        let targetPos = shouldAppendAtEnd ? n - 1 : insertIdx;

        // Try to find a gap nearby
        let rightGap = -1;
        for (let j = targetPos; j < n; j++) {
            if (libArr[j] === GAP_VAL) { rightGap = j; break; }
        }

        if (rightGap !== -1) {
            // Shift right
            for (let j = rightGap; j > targetPos; j--) {
                libArr[j] = libArr[j - 1];
                groups[j] = getColor(libArr[j]);
            }
            libArr[targetPos] = val;
            placed = true;
        } else {
            let leftGap = -1;
            for (let j = targetPos; j >= 0; j--) {
                if (libArr[j] === GAP_VAL) { leftGap = j; break; }
            }
            if (leftGap !== -1) {
                // Shift left
                if (shouldAppendAtEnd) {
                    for (let j = leftGap; j < targetPos; j++) {
                        libArr[j] = libArr[j + 1];
                        groups[j] = getColor(libArr[j]);
                    }
                    libArr[targetPos] = val;
                } else {
                    for (let j = leftGap; j < targetPos - 1; j++) {
                        libArr[j] = libArr[j + 1];
                        groups[j] = getColor(libArr[j]);
                    }
                    libArr[targetPos - 1] = val;
                    targetPos--;
                }
                placed = true;
            }
        }

        // 3. If still not placed (no gaps!), Rebalance and try again
        if (!placed) {
            if (!(await rebalance(libArr))) return false;
            // Retry this element
            i--; 
            continue;
        }

        groups[targetPos] = getColor(val);
        setArray([...libArr]);
        setGroupIndices({ ...groups });
        setSwapIndices([targetPos]);
        countSwap();
        playSound(val, 'triangle', targetPos);
        if (!(await wait(0.5))) return false;
        setSwapIndices([]);

        // Periodically rebalance to keep gaps open
        if (i > 0 && i % Math.max(2, Math.floor(n / 10)) === 0 && i < n - 1) {
            if (!(await rebalance(libArr))) return false;
        }
    }

    // Final state: Close all gaps (Compact) without making books disappear again.
    setDescription({ text: "Finalizing: Closing shelf gaps...", type: "SWAP" });
    const finalItems = libArr.filter(x => x !== GAP_VAL);
    const resultArr = [...finalItems];
    const compactGroups = {};

    for (let i = 0; i < n; i++) {
        compactGroups[i] = getColor(resultArr[i]);
    }

    setArray([...resultArr]);
    setGroupIndices({ ...compactGroups });
    setSortedIndices([]);
    if (!(await wait(0.5))) return false;

    for (let i = 0; i < n; i++) {
        setSortedIndices([...Array(i + 1).keys()]);
        playSound(resultArr[i], 'sine', i);
        if (!(await wait(0.1))) return false;
    }

    setDisableGroupGaps(true);
    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
