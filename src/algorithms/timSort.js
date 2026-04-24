
export const timSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const RUN = Math.min(32, n);
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setDisableGroupGaps?.(true);
    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // Phase 1: Rich Insertion sort on small runs
    const insertionSortRun = async (left, right, runIdx) => {
        for (let i = left + 1; i <= right; i++) {
            if (!sortingRef.current) return;

            const sortedRunPrefix = [];
            for (let k = left; k < i; k++) sortedRunPrefix.push(k);
            setSortedIndices(sortedRunPrefix);
            setGroupIndices({});
            setGoodIndices([i]);
            setCompareIndices([]);
            setSwapIndices([]);
            setDescription({ text: `Run ${runIdx}: Inserting next item`, type: 'TARGET' });
            if (!(await wait(0.6))) return;

            let temp = arr[i];
            let j = i - 1;
            let pivotPos = i;

            while (j >= left) {
                if (!sortingRef.current) return;

                setSortedIndices(sortedRunPrefix);
                setCompareIndices([j, pivotPos]);
                setGoodIndices([pivotPos]);
                countCompare();
                setDescription({ text: 'Comparing inside current run', type: 'COMPARE' });
                playSound(arr[j], 'sine', j);
                if (!(await wait(0.8))) break;

                if (arr[j] > temp) {
                    setDescription({ text: 'Shifting larger value right', type: 'SWAP' });
                    setSwapIndices([j, j + 1]);
                    countSwap();
                    arr[j + 1] = arr[j];
                    setArray([...arr]);
                    if (!(await wait(0.8))) break;
                    
                    pivotPos = j;
                    setSwapIndices([]);
                    j--;
                } else {
                    setDescription({ text: 'Found insertion point', type: 'TARGET' });
                    break;
                }
            }

            arr[j + 1] = temp;
            setCompareIndices([]);
            const settledPrefix = [];
            for (let k = left; k <= i; k++) settledPrefix.push(k);
            setSortedIndices(settledPrefix);
            setGoodIndices([j + 1]);
            setSwapIndices([j + 1]);
            setArray([...arr]);
            if (!(await wait(0.7))) return;
            setSwapIndices([]);
            setGoodIndices([]);
        }
    };

    // Phase 2: Rich Merge two sorted runs
    const merge = async (l, m, r) => {
        const leftArr = arr.slice(l, m + 1);
        const rightArr = arr.slice(m + 1, r + 1);

        const mergeGroups = {};
        for (let idx = l; idx <= r; idx++) {
            mergeGroups[idx] = idx <= m ? palette[2] : palette[3];
        }
        setGroupIndices(mergeGroups);
        setCompareIndices([]);
        setGoodIndices([l]);
        setDescription({ text: 'Merging sorted runs', type: 'SWAP' });
        if (!(await wait(0.8))) return;

        let i = 0, j = 0, k = l;

        while (i < leftArr.length && j < rightArr.length) {
            if (!sortingRef.current) return;
            
            setCompareIndices([k]);
            setGoodIndices([k]);
            countCompare();
            setDescription({ text: 'Writing next merged value', type: 'COMPARE' });
            playSound(arr[k], 'sine', k);
            if (!(await wait(0.8))) return;

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i++];
            } else {
                arr[k] = rightArr[j++];
            }

            delete mergeGroups[k];
            setGroupIndices({ ...mergeGroups });
            setSwapIndices([k]);
            countSwap();
            setArray([...arr]);
            playSound(arr[k], 'triangle', k);
            if (!(await wait(0.8))) return;
            setSwapIndices([]);
            k++;
        }

        const finalize = async (list, pointer) => {
            while (pointer < list.length) {
                if (!sortingRef.current) break;
                arr[k] = list[pointer];
                setGoodIndices([k]);
                setArray([...arr]);
                setSwapIndices([k]);
                countSwap();
                delete mergeGroups[k];
                setGroupIndices({ ...mergeGroups });
                if (!(await wait(0.8))) break;
                setSwapIndices([]);
                pointer++; k++;
            }
        };

        await finalize(leftArr, i);
        await finalize(rightArr, j);

        setCompareIndices([]);
        setGoodIndices([]);
        setGroupIndices({});
    };

    // 1. Divide and Insertion Sort Runs
    let runCount = 0;
    for (let i = 0; i < n; i += RUN) {
        if (!sortingRef.current) break;
        const right = Math.min(i + RUN - 1, n - 1);
        await insertionSortRun(i, right, ++runCount);
    }

    // 2. Merge Runs bottom-up
    for (let size = RUN; size < n; size *= 2) {
        if (!sortingRef.current) break;

        for (let left = 0; left < n; left += 2 * size) {
            if (!sortingRef.current) break;
            const mid = Math.min(left + size - 1, n - 1);
            const right = Math.min(left + 2 * size - 1, n - 1);

            if (mid < right) {
                await merge(left, mid, right);
            }
        }
    }

    if (!sortingRef.current) {
        setDisableGroupGaps?.(false);
        return false;
    }

    setDisableGroupGaps?.(false);
    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
