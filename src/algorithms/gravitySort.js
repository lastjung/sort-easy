
export const gravitySort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const max = Math.max(...arr);

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // 1. Setup: Build bead grid
    const beads = Array.from({ length: n }, () => new Array(max).fill(0));

    setDescription(msg.SETUP);
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        for (let j = 0; j < arr[i]; j++) {
            beads[i][j] = 1;
        }
        setCompareIndices([i]);
        countCompare();
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.5))) break;
    }
    setCompareIndices([]);

    // 2. Gravity Drop: beads fall down column by column
    setDescription(msg.DROP);
    if (!(await wait(1))) return;

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
        setArray([...arr]);

        // Color by value magnitude (shows beads organizing)
        const groups = {};
        for (let i = 0; i < n; i++) {
            groups[i] = palette[Math.floor(arr[i] / (max / 5)) % palette.length];
        }
        setGroupIndices({ ...groups });

        setSwapIndices([Math.max(0, n - sum - 1), n - 1]);
        playSound(palette.length > 0 ? (j * 10 % 100) : 50, 'triangle', Math.floor(n / 2)); // Column sound
        if (!(await wait(1))) break;
        setSwapIndices([]);
    }

    // 3. Writeback: confirm each position
    setDescription(msg.WRITE);
    setGroupIndices({});
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
        setSwapIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.5))) break;
        setSwapIndices([]);
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
