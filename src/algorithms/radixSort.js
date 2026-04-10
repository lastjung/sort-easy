
export const radixSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const max = Math.max(...arr);
    let exp = 1;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    const digitLabel = (e) => e === 1 ? "1's" : e === 10 ? "10's" : e === 100 ? "100's" : `${e}'s`;

    while (Math.floor(max / exp) > 0) {
        if (!sortingRef.current) break;

        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        // 1. Count frequencies (no color change, just scan)
        setDescription({ text: `Scanning ${digitLabel(exp)} Digit...`, type: 'TARGET' });
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            countCompare();
            setCompareIndices([i]);
            playSound(arr[i], 'sine', i);
            if (!(await wait(0.5))) break;
        }
        setCompareIndices([]);

        // 2. Cumulative count
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // 3. Build output array
        for (let i = n - 1; i >= 0; i--) {
            if (!sortingRef.current) break;
            const digit = Math.floor(arr[i] / exp) % 10;
            output[--count[digit]] = arr[i];
        }

        // 4. Write back — color each element as it's placed
        const groups = {};
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            setDescription({ text: `Placing by ${digitLabel(exp)} Digit...`, type: 'SWAP' });
            arr[i] = output[i];
            setArray([...arr]);

            // Color this element by its digit immediately
            const digit = Math.floor(arr[i] / exp) % 10;
            groups[i] = palette[digit % palette.length];
            setGroupIndices({ ...groups });

            setSwapIndices([i]);
            countSwap();
            playSound(arr[i], 'triangle', i);
            if (!(await wait(1))) break;
            setSwapIndices([]);
        }

        // Brief pause to appreciate the grouped result
        if (sortingRef.current) {
            setDescription({ text: `${digitLabel(exp)} Digit Sorted!`, type: 'SUCCESS' });
            if (!(await wait(2))) break;
            setGroupIndices({});
        }

        exp *= 10;
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
