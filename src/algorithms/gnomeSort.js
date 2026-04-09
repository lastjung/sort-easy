
export const gnomeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let index = 0;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    const paintRainbow = () => {
        const groups = {};
        for (let i = 0; i < n; i++) {
            groups[i] = palette[i % palette.length];
        }
        setGroupIndices(groups);
    };

    paintRainbow();
    setDescription(msg.START);
    if (!(await wait(1))) return;

    while (index < n) {
        if (!sortingRef.current) break;

        if (index === 0) {
            index++;
        }

        setCompareIndices([index, index - 1]);
        setSwapIndices([]);
        countCompare();
        setDescription(msg.COMPARE);
        playSound(200 + arr[index] * 5, 'sine');
        if (!(await wait(1))) break;

        if (arr[index] >= arr[index - 1]) {
            index++;
        } else {
            // Swap
            setCompareIndices([]);
            setSwapIndices([index, index - 1]);
            setDescription(msg.SWAP);
            playSound(100 + arr[index] * 5, 'sawtooth');
            
            countSwap();
            [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
            setArray([...arr]);
            if (!(await wait(1))) break;
            setSwapIndices([]);
            index--;
        }
    }

    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
