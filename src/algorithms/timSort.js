
export const timSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const RUN = Math.min(32, n);

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // Phase 1: Insertion sort on small runs
    const insertionSortRun = async (left, right) => {
        for (let i = left + 1; i <= right; i++) {
            if (!sortingRef.current) return;
            let temp = arr[i];
            let j = i - 1;

            while (j >= left && arr[j] > temp) {
                if (!sortingRef.current) return;
                setCompareIndices([j, i]);
                countCompare();
                playSound(200 + arr[j] * 5, 'sine');
                if (!(await wait(0.5))) return;

                arr[j + 1] = arr[j];
                setArray([...arr]);
                setSwapIndices([j, j + 1]);
                countSwap();
                if (!(await wait(0.5))) return;
                setSwapIndices([]);
                j--;
            }
            arr[j + 1] = temp;
            setArray([...arr]);
        }
    };

    // Phase 2: Merge two sorted runs
    const merge = async (l, m, r) => {
        const left = arr.slice(l, m + 1);
        const right = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;

        while (i < left.length && j < right.length) {
            if (!sortingRef.current) return;
            setCompareIndices([l + i, m + 1 + j]);
            countCompare();
            playSound(200 + arr[k] * 5, 'sine');
            if (!(await wait(0.5))) return;

            if (left[i] <= right[j]) {
                arr[k] = left[i++];
            } else {
                arr[k] = right[j++];
            }
            setSwapIndices([k]);
            countSwap();
            setArray([...arr]);
            playSound(100 + arr[k] * 5, 'sawtooth');
            if (!(await wait(0.5))) return;
            setSwapIndices([]);
            k++;
        }

        while (i < left.length) {
            if (!sortingRef.current) return;
            arr[k] = left[i++];
            setSwapIndices([k]);
            setArray([...arr]);
            countSwap();
            if (!(await wait(0.3))) return;
            setSwapIndices([]);
            k++;
        }
        while (j < right.length) {
            if (!sortingRef.current) return;
            arr[k] = right[j++];
            setSwapIndices([k]);
            setArray([...arr]);
            countSwap();
            if (!(await wait(0.3))) return;
            setSwapIndices([]);
            k++;
        }
    };

    // Run insertion sort on each run block
    let runCount = 0;
    for (let i = 0; i < n; i += RUN) {
        if (!sortingRef.current) break;
        const right = Math.min(i + RUN - 1, n - 1);

        // Paint current run being sorted
        const groups = {};
        for (let k = 0; k < n; k++) {
            groups[k] = k >= i && k <= right ? palette[1] : palette[0];
        }
        setGroupIndices(groups);
        setDescription({ text: `Insertion Sort Run ${++runCount}`, type: 'TARGET' });

        await insertionSortRun(i, right);
    }

    // Merge runs bottom-up
    for (let size = RUN; size < n; size *= 2) {
        if (!sortingRef.current) break;

        for (let left = 0; left < n; left += 2 * size) {
            if (!sortingRef.current) break;
            const mid = Math.min(left + size - 1, n - 1);
            const right = Math.min(left + 2 * size - 1, n - 1);

            if (mid < right) {
                // Paint merge range
                const groups = {};
                for (let k = 0; k < n; k++) {
                    if (k >= left && k <= mid) groups[k] = palette[1];
                    else if (k > mid && k <= right) groups[k] = palette[3];
                    else groups[k] = palette[0];
                }
                setGroupIndices(groups);
                setDescription({ text: `Merging Blocks (size ${size})`, type: 'SWAP' });

                await merge(left, mid, right);
            }
        }
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
