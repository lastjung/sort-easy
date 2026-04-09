
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

    while (Math.floor(max / exp) > 0) {
        if (!sortingRef.current) break;

        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        // 1. Paint ALL elements by current digit at once (scatter view)
        const groups = {};
        for (let i = 0; i < n; i++) {
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            groups[i] = palette[digit % palette.length];
        }
        setGroupIndices({ ...groups });
        setDescription(msg.COUNT);
        if (!(await wait(1.5))) break;

        // 2. Scan — highlight each element briefly
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            setCompareIndices([i]);
            countCompare();
            playSound(200 + arr[i] * 5, 'sine');
            if (!(await wait(0.5))) break;
        }
        setCompareIndices([]);

        // 3. Cumulative count
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // 4. Build output array
        for (let i = n - 1; i >= 0; i--) {
            if (!sortingRef.current) break;
            const digit = Math.floor(arr[i] / exp) % 10;
            output[--count[digit]] = arr[i];
        }

        // 5. Write back — colors reorganize as elements find their positions
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            setDescription(msg.WRITE);
            arr[i] = output[i];

            // Re-color by digit at new position
            const newDigit = Math.floor(arr[i] / exp) % 10;
            groups[i] = palette[newDigit % palette.length];
            setGroupIndices({ ...groups });

            setArray([...arr]);
            setSwapIndices([i]);
            countSwap();
            playSound(100 + arr[i] * 5, 'sawtooth');
            if (!(await wait(1))) break;
            setSwapIndices([]);
        }

        exp *= 10;
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
