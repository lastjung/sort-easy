
export const gravitySort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const sourceArr = [...array];
    const arr = new Array(sourceArr.length).fill(0);
    const n = sourceArr.length;
    const max = Math.max(...sourceArr);

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setArray([...arr]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // 1. Setup: Build bead grid
    const beads = Array.from({ length: n }, () => new Array(max).fill(0));

    setDescription(msg.SETUP);
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        for (let j = 0; j < sourceArr[i]; j++) {
            beads[i][j] = 1;
        }
        arr[i] = sourceArr[i];
        setArray([...arr]);
        setCompareIndices([i]);
        setGoodIndices([i]);
        countCompare();
        playSound(sourceArr[i], 'sine', i);
        if (!(await wait(0.35))) break;
    }
    setCompareIndices([]);
    setGoodIndices([]);

    // 2. Gravity Drop: beads fall down column by column
    setDescription(msg.DROP);
    if (!(await wait(0.8))) return;

    const getColorByValue = (value) => {
        if (max <= 1) return palette[0];
        const bucket = Math.min(Math.floor((value / max) * palette.length), palette.length - 1);
        return palette[bucket];
    };

    for (let j = 0; j < max; j++) {
        if (!sortingRef.current) break;

        // Count beads in this column
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += beads[i][j];
            beads[i][j] = 0;
        }

        // Drop beads to the bottom
        for (let i = n - sum; i < n; i++) {
            beads[i][j] = 1;
        }

        // Update array values from bead state
        for (let i = 0; i < n; i++) {
            let count = 0;
            for (let k = 0; k < max; k++) {
                count += beads[i][k];
            }
            if (arr[i] !== count) {
                countSwap();
            }
            arr[i] = count;
        }
        const groups = {};
        for (let i = 0; i < n; i++) {
            groups[i] = getColorByValue(arr[i]);
        }
        const settledStart = Math.max(0, n - sum);
        setDescription({ text: `Dropping bead column ${j + 1}/${max}`, type: "SWAP" });
        setGoodIndices([...Array(sum).keys()].map(idx => settledStart + idx));
        setSwapIndices(sum > 0 ? [settledStart, n - 1] : []);
        setArray([...arr]);
        setGroupIndices({ ...groups });
        playSound(palette.length > 0 ? (j * 10 % 100) : 50, 'triangle', Math.floor(n / 2)); // Column sound
        if (!(await wait(0.7))) break;
        setSwapIndices([]);
    }
    setGoodIndices([]);

    // 3. Writeback: confirm each position
    setDescription(msg.WRITE);
    setGroupIndices({});
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        setSortedIndices([...Array(i).keys()]);
        setSwapIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.35))) break;
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
