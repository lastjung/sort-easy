
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

            setGoodIndices([i]);

            const splitGroups = {};
            for (let k = 0; k < n; k++) {
                splitGroups[k] = (k >= left && k < i) ? palette[0] : palette[1];
            }
            setGroupIndices(splitGroups);
            setSortedIndices([]);
            setCompareIndices([]);
            setSwapIndices([]);
            setDescription({ text: `Run ${runIdx}: Picking next pivot`, type: 'TARGET' });
            if (!(await wait(0.4))) return;
            if (!sortingRef.current) return;
            if (!(await wait(0.5))) return;

            const joinedGroups = {};
            for (let k = 0; k < n; k++) {
                joinedGroups[k] = (k >= left && k <= i) ? palette[0] : palette[1];
            }
            setGroupIndices(joinedGroups);
            if (!(await wait(0.4))) return;
            if (!sortingRef.current) return;

            let pivotPos = i;
            let j = i - 1;
            
            while (j >= left) {
                if (!sortingRef.current) return;
                
                setGoodIndices([pivotPos]);
                setCompareIndices([]);
                countCompare();
                setDescription({ text: `Run ${runIdx}: Comparing pivot`, type: 'COMPARE' });
                playSound(arr[j], 'sine', j);
                if (!(await wait(1))) return;
                
                if (arr[j] > arr[j + 1]) {
                    setGoodIndices([pivotPos]);
                    setSortedIndices([j]);
                    setDescription({ text: `Run ${runIdx}: Shifting right`, type: 'SWAP' });
                    playSound(arr[j], 'triangle', j);
                    countSwap();
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    if (!(await wait(1))) return;
                    
                    pivotPos = j;
                    setSortedIndices([]);
                    j--;
                } else {
                    setDescription({ text: `Run ${runIdx}: Found insertion point`, type: 'TARGET' });
                    break;
                }
            }

            setCompareIndices([]);
            setSwapIndices([]);
            setGroupIndices({});
            const settledPrefix = [];
            for (let k = left; k <= i; k++) settledPrefix.push(k);
            setSortedIndices(settledPrefix);
            setGoodIndices([]);
            playSound(arr[i], 'sine', i);
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
