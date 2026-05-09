export const stoogeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setSortedIndices([]);
    setGoodIndices([]);
    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    const stoogeSortHelper = async (l, h, depth) => {
        if (!sortingRef.current) return false;
        if (l >= h) return true;

        // Visual recursion grouping: Highlight current active range
        const groups = {};
        for (let k = 0; k < n; k++) {
            if (k >= l && k <= h) {
                // Color the current sorting sub-range
                groups[k] = palette[depth % palette.length];
            }
        }
        setGroupIndices({ ...groups });

        // Compare elements at l and h
        countCompare();
        setCompareIndices([l, h]);
        setDescription({ text: "Comparing endpoints", type: "COMPARE" });
        playSound(arr[l], 'sine', l);
        if (!(await wait(1))) return false;

        if (arr[l] > arr[h]) {
            // Swap if out of order
            let temp = arr[l];
            arr[l] = arr[h];
            arr[h] = temp;

            countSwap();
            setCompareIndices([]);
            setSwapIndices([l, h]);
            setDescription({ text: "Swapping endpoints", type: "SWAP" });
            setArray([...arr]);
            playSound(arr[l], 'triangle', l);
            if (!(await wait(1))) return false;
            setSwapIndices([]);
        }

        setCompareIndices([]);

        // If there are more than 2 elements
        if (h - l + 1 > 2) {
            let t = Math.floor((h - l + 1) / 3);

            // Sort first 2/3
            setDescription({ text: "Sorting first 2/3 range", type: "TARGET" });
            if (!(await stoogeSortHelper(l, h - t, depth + 1))) return false;

            // Sort last 2/3
            setDescription({ text: "Sorting last 2/3 range", type: "TARGET" });
            if (!(await stoogeSortHelper(l + t, h, depth + 1))) return false;

            // Sort first 2/3 again
            setDescription({ text: "Re-sorting first 2/3 range", type: "TARGET" });
            if (!(await stoogeSortHelper(l, h - t, depth + 1))) return false;
        }

        return true;
    };

    const success = await stoogeSortHelper(0, n - 1, 0);
    if (!sortingRef.current || !success) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
