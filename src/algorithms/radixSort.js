
export const radixSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const max = Math.max(...arr);
    let exp = 1;
    let pass = 1;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setDescription(msg.START);
    if (!(await wait(1))) return;

    while (Math.floor(max / exp) > 0) {
        if (!sortingRef.current) break;
        
        setDescription(msg.COUNT);
        
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        // 1. Counting frequencies & Painting by digit
        const groups = {};
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            
            groups[i] = palette[digit % palette.length];
            setGroupIndices({...groups});

            setCompareIndices([i]);
            playSound(200 + arr[i] * 5, 'sine');
            if (!(await wait(0.5))) break;
        }

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

        // 4. Copy to original array with visualization
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) break;
            setDescription(msg.WRITE);
            arr[i] = output[i];
            setArray([...arr]);
            setSwapIndices([i]);
            countSwap();
            playSound(100 + arr[i] * 5, 'sawtooth');
            if (!(await wait(1))) break;
            setSwapIndices([]);
        }

        exp *= 10;
        pass++;
    }

    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
