
export const tournamentSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
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

    // Phase 0: Classification (8 Groups)
    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const range = maxVal - minVal + 1;
    const getColor = (val) => {
        if (range <= 1) return palette[0];
        const groupIdx = Math.floor(((val - minVal) / range) * 8);
        return palette[Math.min(groupIdx, 7)];
    };

    const groups = {};
    for (let i = 0; i < n; i++) {
        groups[i] = getColor(arr[i]);
        setGroupIndices({ ...groups });
        setCompareIndices([i]);
        setGoodIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.2))) return false;
    }
    setCompareIndices([]);
    setGoodIndices([]);

    // Set of indices that have already "won" and are now in the sorted portion
    const finishedIndices = new Set();

    for (let round = 0; round < n; round++) {
        if (!sortingRef.current) return false;
        
        // Participants are those whose index is NOT in the finishedIndices set
        let tournament = [];
        for (let i = 0; i < n; i++) {
            if (!finishedIndices.has(i)) tournament.push(i);
        }
        
        if (tournament.length === 0) break;

        setDescription({ text: `Tournament Round ${round + 1}: Competing for Rank ${round + 1}`, type: "TARGET" });
        setGoodIndices(tournament);
        if (!(await wait(0.3))) return false;

        // Simulate bracket levels
        let bracketLevel = 1;
        while (tournament.length > 1) {
            let nextLevel = [];
            for (let i = 0; i < tournament.length; i += 2) {
                if (!sortingRef.current) return false;
                
                const left = tournament[i];
                const right = tournament[i + 1];

                if (right === undefined) {
                    nextLevel.push(left);
                    continue;
                }

                setDescription({ text: `Round ${round + 1}, Match ${Math.floor(i / 2) + 1}: Bracket ${bracketLevel}`, type: "COMPARE" });
                setCompareIndices([left, right]);
                setGoodIndices([left, right]);
                countCompare();
                playSound(arr[left], 'sine', left);
                if (!(await wait(0.4))) return false;

                if (arr[left] <= arr[right]) {
                    setGoodIndices([left]);
                    nextLevel.push(left);
                } else {
                    setGoodIndices([right]);
                    nextLevel.push(right);
                }
                if (!(await wait(0.4))) return false;
                setGoodIndices([]);
            }
            setGoodIndices(nextLevel);
            if (!(await wait(0.25))) return false;
            tournament = nextLevel;
            bracketLevel++;
        }

        // Winner of this tournament pass
        const winnerIdxInArr = tournament[0];
        const targetIdx = round;
        
        // Final move for this winner
        setDescription({ text: `Winner '${arr[winnerIdxInArr]}' takes Rank ${round + 1}!`, type: "SWAP" });
        
        setSwapIndices([targetIdx, winnerIdxInArr]);
        countSwap();
        
        // Logic swap
        const temp = arr[targetIdx];
        arr[targetIdx] = arr[winnerIdxInArr];
        arr[winnerIdxInArr] = temp;
        
        // Update visual colors and array
        groups[targetIdx] = getColor(arr[targetIdx]);
        groups[winnerIdxInArr] = getColor(arr[winnerIdxInArr]);
        
        setArray([...arr]);
        setGroupIndices({ ...groups });
        setSortedIndices([...Array(round + 1).keys()]);
        setGoodIndices([targetIdx]);
        
        // Mark the NEW targetIdx as finished (it's now sorted)
        finishedIndices.add(targetIdx);
        
        playSound(arr[targetIdx], 'triangle', targetIdx);
        if (!(await wait(1))) return false;
        
        setCompareIndices([]);
        setGoodIndices([]);
        setSwapIndices([]);
    }

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
