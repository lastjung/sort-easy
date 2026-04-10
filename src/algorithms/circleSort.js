
export const circleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    let swaps = 0;

    const circleSortRecursive = async (low, high) => {
        if (low === high) return false;

        let swapped = false;
        let l = low;
        let h = high;

        // Visualize current range
        const groups = {};
        for (let k = 0; k < n; k++) {
            if (k >= low && k <= high) groups[k] = palette[1];
            else groups[k] = palette[0];
        }
        setGroupIndices(groups);
        setDescription({ text: `Processing Circle [${low}-${high}]`, type: 'TARGET' });
        if (!(await wait(0.5))) return false;

        while (l < h) {
            if (!sortingRef.current) return false;

            setCompareIndices([l, h]);
            countCompare();
            playSound(arr[l], 'sine', l);
            if (!(await wait(1))) return false;

            if (arr[l] > arr[h]) {
                setSwapIndices([l, h]);
                playSound(arr[l], 'triangle', l);
                countSwap();
                [arr[l], arr[h]] = [arr[h], arr[l]];
                setArray([...arr]);
                swapped = true;
                if (!(await wait(1))) return false;
                setSwapIndices([]);
            }
            l++;
            h--;
        }

        if (l === h) {
            // Special case for odd number of elements
            setCompareIndices([l, h + 1]);
            countCompare();
            if (arr[l] > arr[h + 1]) {
                setSwapIndices([l, h + 1]);
                countSwap();
                [arr[l], arr[h + 1]] = [arr[h + 1], arr[l]];
                setArray([...arr]);
                swapped = true;
                if (!(await wait(1))) return false;
                setSwapIndices([]);
            }
        }

        let mid = Math.floor((high - low) / 2);
        let leftSwapped = await circleSortRecursive(low, low + mid);
        let rightSwapped = await circleSortRecursive(low + mid + 1, high);

        return swapped || leftSwapped || rightSwapped;
    };

    while (true) {
        if (!sortingRef.current) break;
        let swapped = await circleSortRecursive(0, n - 1);
        if (!swapped) break;
        swaps++;
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
