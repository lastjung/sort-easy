
export const gnomeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let index = 0;
    let maxIndex = 0;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    const paintDivide = () => {
        const groups = {};
        for (let i = 0; i < n; i++) {
            groups[i] = i < maxIndex ? palette[0] : palette[1];
        }
        setGroupIndices(groups);
    };

    setGroupIndices({});
    setDescription(msg.START);
    if (!(await wait(1))) return;

    while (index < n) {
        if (!sortingRef.current) break;

        if (index === 0) {
            index++;
        }

        // Track the frontier
        if (index > maxIndex) {
            maxIndex = index;
            paintDivide();
        }

        setCompareIndices([index, index - 1]);
        setSwapIndices([]);
        countCompare();
        setDescription(msg.COMPARE);
        playSound(arr[index], 'sine', index);
        if (!(await wait(1))) break;

        if (arr[index] >= arr[index - 1]) {
            index++;
        } else {
            // Swap
            setCompareIndices([]);
            setSwapIndices([index, index - 1]);
            setDescription(msg.SWAP);
            playSound(arr[index - 1], 'triangle', index - 1);

            countSwap();
            [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
            setArray([...arr]);
            if (!(await wait(1))) break;
            setSwapIndices([]);
            index--;
        }
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
