
export const librarySort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const originalArr = [...array];
    const n = originalArr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(false);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Standard Library Sort: Use gaps to optimize insertions
    const GAP_VAL = -1; 
    let libArr = new Array(n).fill(GAP_VAL);
    const groups = {};

    const getColor = (val) => {
        if (val === GAP_VAL) return "#1a1a2e";
        const minVal = Math.min(...originalArr);
        const maxVal = Math.max(...originalArr);
        const range = maxVal - minVal + 1;
        const groupIdx = Math.floor(((val - minVal) / range) * 5);
        return palette[Math.min(groupIdx, 4)];
    };

    // Rebalance: Spread elements to maintain O(1) insertions
    const rebalance = (currentLib) => {
        const items = currentLib.filter(x => x !== GAP_VAL);
        const newLib = new Array(n).fill(GAP_VAL);
        const step = n / (items.length + 1);
        for (let i = 0; i < items.length; i++) {
            const idx = Math.floor((i + 1) * step);
            newLib[idx] = items[i];
        }
        return newLib;
    };

    // 1. Initial placement of the first element
    libArr[Math.floor(n / 2)] = originalArr[0];

    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) return false;
        const val = originalArr[i];
        setDescription({ text: `Library: Placing '${val}' using Binary Search...`, type: "INFO" });

        // 2. Binary Search among non-gap elements
        let left = 0, right = n - 1;
        while (left < n && libArr[left] === GAP_VAL) left++;
        while (right >= 0 && libArr[right] === GAP_VAL) right--;

        let targetIdx = -1;
        if (val < libArr[left]) {
            targetIdx = left;
        } else if (val > libArr[right]) {
            targetIdx = right + 1;
        } else {
            // Find insertion point between non-gap elements
            let searchLeft = left, searchRight = right;
            while (searchLeft <= searchRight) {
                let mid = Math.floor((searchLeft + searchRight) / 2);
                // Find nearest non-gap to mid
                let midValIdx = mid;
                while (midValIdx <= searchRight && libArr[midValIdx] === GAP_VAL) midValIdx++;
                
                if (midValIdx > searchRight) {
                    searchRight = mid - 1;
                    continue;
                }

                setCompareIndices([midValIdx]);
                if (libArr[midValIdx] === val) {
                    targetIdx = midValIdx;
                    break;
                } else if (libArr[midValIdx] < val) {
                    searchLeft = midValIdx + 1;
                    targetIdx = searchLeft;
                } else {
                    searchRight = midValIdx - 1;
                    targetIdx = midValIdx;
                }
            }
        }

        // 3. Insert and Shift (Library Shifting)
        let placed = false;
        let pos = Math.max(0, Math.min(n - 1, targetIdx));

        // Check right for gap
        let rightGap = -1;
        for (let j = pos; j < n; j++) if (libArr[j] === GAP_VAL) { rightGap = j; break; }

        if (rightGap !== -1) {
            for (let j = rightGap; j > pos; j--) libArr[j] = libArr[j - 1];
            libArr[pos] = val;
            placed = true;
        } else {
            // Check left for gap
            let leftGap = -1;
            for (let j = pos; j >= 0; j--) if (libArr[j] === GAP_VAL) { leftGap = j; break; }
            if (leftGap !== -1) {
                for (let j = leftGap; j < pos - 1; j++) libArr[j] = libArr[j + 1];
                libArr[pos - 1] = val;
                placed = true;
            }
        }

        // 4. Rebalance if the shelf is full
        if (!placed) {
            libArr = rebalance(libArr);
            i--; // Retry this element after rebalance
            continue;
        }

        // Visualization
        for (let j = 0; j < n; j++) groups[j] = getColor(libArr[j]);
        setArray([...libArr]);
        setGroupIndices({...groups});
        setSwapIndices([pos]);
        countSwap();
        playSound(val, 'sine', pos);
        if (!(await wait(0.3))) return false;

        // Periodic Rebalance to maintain gaps
        if (i % Math.max(1, Math.floor(n / 10)) === 0 && i < n - 1) {
            libArr = rebalance(libArr);
            for (let j = 0; j < n; j++) groups[j] = getColor(libArr[j]);
            setArray([...libArr]);
            setGroupIndices({...groups});
            if (!(await wait(0.5))) return false;
        }
    }

    // 5. Final Compaction: Remove all gaps for the final result
    setDescription({ text: "Finalizing: Closing all gaps...", type: "SWAP" });
    const finalItems = libArr.filter(x => x !== GAP_VAL);
    const result = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        result[i] = finalItems[i];
        groups[i] = getColor(result[i]);
        setArray([...result.slice(0, i + 1), ...new Array(n - i - 1).fill(0)]);
        setGroupIndices({...groups});
        playSound(result[i], 'sine', i);
        if (!(await wait(0.1))) return false;
    }
    setArray([...result]);

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
