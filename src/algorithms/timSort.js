
export const timSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const RUN = Math.min(32, n);

    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setGroupIndices({});
    setSortedIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return;

    // Phase 1: Rich Insertion sort on small runs
    const insertionSortRun = async (left, right, runIdx) => {
        for (let i = left + 1; i <= right; i++) {
            if (!sortingRef.current) return;
            
            // PICK PHASE
            setGoodIndices([i]);
            const splitGroups = {};
            for (let k = 0; k < n; k++) {
                if (k >= left && k <= right) {
                    splitGroups[k] = k < i ? palette[0] : palette[1];
                } else {
                    splitGroups[k] = 'transparent';
                }
            }
            setGroupIndices(splitGroups);
            setDescription({ text: `Run ${runIdx}: Picking element`, type: 'TARGET' });
            if (!(await wait(0.8))) return;

            let temp = arr[i];
            let j = i - 1;
            let pivotPos = i;

            while (j >= left) {
                if (!sortingRef.current) return;
                
                setGoodIndices([pivotPos]);
                countCompare();
                setDescription(msg.COMPARE);
                playSound(200 + arr[j] * 5, 'sine');
                if (!(await wait(1))) break;

                if (arr[j] > temp) {
                    setDescription(msg.SHIFT);
                    setSwapIndices([j, j + 1]);
                    countSwap();
                    arr[j + 1] = arr[j];
                    setArray([...arr]);
                    if (!(await wait(1))) break;
                    
                    pivotPos = j;
                    setSwapIndices([]);
                    j--;
                } else {
                    setDescription(msg.INSERT);
                    break;
                }
            }
            arr[j + 1] = temp;
            setArray([...arr]);
            setGoodIndices([]);
        }
    };

    // Phase 2: Rich Merge two sorted runs
    const merge = async (l, m, r) => {
        const leftArr = arr.slice(l, m + 1);
        const rightArr = arr.slice(m + 1, r + 1);
        
        const mergeRange = [...Array(r - l + 1).keys()].map(x => x + l);
        setCompareIndices(mergeRange);
        setDescription(msg.MERGE);
        if (!(await wait(1))) return;

        let i = 0, j = 0, k = l;
        const currentGroups = {};
        for(let idx = l; idx <= r; idx++) {
            currentGroups[idx] = idx <= m ? palette[1] : palette[3];
        }
        setGroupIndices(currentGroups);

        while (i < leftArr.length && j < rightArr.length) {
            if (!sortingRef.current) return;
            
            setCompareIndices(mergeRange.filter(idx => idx >= k));
            countCompare();
            setDescription(msg.COMPARE);
            playSound(200 + arr[k] * 5, 'sine');
            if (!(await wait(1))) return;

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i++];
            } else {
                arr[k] = rightArr[j++];
            }
            
            // Remove group color as it's merged
            delete currentGroups[k];
            setGroupIndices({...currentGroups});

            setSwapIndices([k]);
            countSwap();
            setArray([...arr]);
            playSound(100 + arr[k] * 5, 'sawtooth');
            if (!(await wait(1))) return;
            setSwapIndices([]);
            k++;
        }

        const finalize = async (list, pointer) => {
            while (pointer < list.length) {
                if (!sortingRef.current) break;
                arr[k] = list[pointer];
                setArray([...arr]);
                setSwapIndices([k]);
                delete currentGroups[k];
                setGroupIndices({...currentGroups});
                countSwap();
                if (!(await wait(0.8))) break;
                setSwapIndices([]);
                pointer++; k++;
            }
        };

        await finalize(leftArr, i);
        await finalize(rightArr, j);

        setCompareIndices([]);
    };

    // 1. Divide and Insertion Sort Runs
    let runCount = 0;
    for (let i = 0; i < n; i += RUN) {
        if (!sortingRef.current) break;
        const right = Math.min(i + RUN - 1, n - 1);
        await insertionSortRun(i, right, ++runCount);
        
        // Mark run as "partially sorted" for Tube Mode
        const sorted = [];
        for(let s = 0; s <= right; s++) sorted.push(s);
        setSortedIndices(sorted);
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
                
                // Update sorted indices
                const sorted = [];
                for(let s = 0; s <= right; s++) sorted.push(s);
                setSortedIndices(sorted);
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
