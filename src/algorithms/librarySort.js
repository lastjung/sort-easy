
export const librarySort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const originalArr = [...array];
    const n = originalArr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(false); // Gaps are meaningful here
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // Phase 0: Classification (Divide into 5 Main Shelf Groups)
    const minVal = Math.min(...originalArr);
    const maxVal = Math.max(...originalArr);
    const range = maxVal - minVal + 1;
    const getColor = (val) => {
        if (val === 3) return "#1a1a2e"; // Shelf Slot color (GAP_VAL)
        // 5 broad categories for a grouped shelving feel
        const groupIdx = Math.floor(((val - minVal) / range) * 5);
        return palette[Math.min(groupIdx, 4)];
    };

    // Visualization array (we use a small constant for gaps to show "slots")
    const GAP_VAL = 3; 
    let libArr = new Array(n).fill(GAP_VAL);
    const groups = {};
    for (let i = 0; i < n; i++) groups[i] = "#1a1a2e"; // Dark shelf color
    
    setArray([...libArr]);
    setGroupIndices({...groups});
    setDescription({ text: "Library: Initializing Shelves with Slots...", type: "TARGET" });
    if (!(await wait(1))) return false;

    // Insert elements one by one
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        const val = originalArr[i];
        
        setDescription({ text: `Placing '${val}' on the best shelf...`, type: "INFO" });
        
        // Find position (simplified visual search)
        let pos = 0;
        while (pos < n && libArr[pos] !== GAP_VAL && libArr[pos] < val) {
            setCompareIndices([pos]);
            playSound(libArr[pos], 'sine', pos);
            if (!(await wait(0.2))) return false;
            pos++;
        }

        // Insertion logic with shifting
        let targetPos = pos;
        if (targetPos < n && libArr[targetPos] === GAP_VAL) {
            libArr[targetPos] = val;
        } else {
            // Find nearest gap to the right
            let gapIdx = targetPos;
            while (gapIdx < n && libArr[gapIdx] !== GAP_VAL) gapIdx++;
            
            if (gapIdx < n) {
                for (let k = gapIdx; k > targetPos; k--) {
                    if (!sortingRef.current) return false;
                    libArr[k] = libArr[k - 1];
                    groups[k] = libArr[k] === GAP_VAL ? "#1a1a2e" : getColor(libArr[k]);
                }
                libArr[targetPos] = val;
            } else {
                // Find nearest gap to the left
                let leftGap = targetPos;
                while (leftGap >= 0 && libArr[leftGap] !== GAP_VAL) leftGap--;
                if (leftGap >= 0) {
                    for (let k = leftGap; k < targetPos - 1; k++) {
                        if (!sortingRef.current) return false;
                        libArr[k] = libArr[k + 1];
                        groups[k] = libArr[k] === GAP_VAL ? "#1a1a2e" : getColor(libArr[k]);
                    }
                    libArr[targetPos - 1] = val;
                    targetPos--; // Adjust for placement
                }
            }
        }

        // Update visuals with current value's color
        groups[targetPos] = getColor(val);
        setArray([...libArr]);
        setGroupIndices({ ...groups });
        setSwapIndices([targetPos]);
        countSwap();
        playSound(val, 'triangle', targetPos);
        if (!(await wait(0.8))) return false;
        
        // Visual Rebalance (every 10 units)
        if (i > 0 && i % 10 === 0) {
            setDescription({ text: "Rebalancing: Optimizing gap distribution...", type: "SWAP" });
            if (!(await wait(0.8))) return false;
        }
    }

    // Final state: Close all gaps
    setDescription({ text: "Finalizing: Closing all shelf gaps...", type: "SWAP" });
    const finalItems = libArr.filter(x => x !== GAP_VAL).sort((a, b) => a - b);
    for (let i = 0; i < n; i++) {
        libArr[i] = finalItems[i];
        groups[i] = getColor(libArr[i]);
    }
    setArray([...libArr]);
    setGroupIndices({...groups});
    if (!(await wait(1))) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
