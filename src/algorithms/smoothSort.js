export const smoothSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
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

    // Leonardo numbers sequence up to n
    const leo = [1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 1219, 1973];

    // Maintain heaps structure: list of { order, rootIndex }
    let heaps = [];

    const updateColors = () => {
        const nextGroups = {};
        heaps.forEach((heap, hIdx) => {
            const color = palette[hIdx % palette.length];
            const start = heap.rootIndex - leo[heap.order] + 1;
            for (let k = start; k <= heap.rootIndex; k++) {
                nextGroups[k] = color;
            }
        });
        setGroupIndices(nextGroups);
    };

    const siftDown = async (r, k) => {
        let curr = r;
        let currK = k;
        while (currK >= 2) {
            if (!sortingRef.current) return;

            let rc = curr - 1; // right child
            let lc = curr - 1 - leo[currK - 2]; // left child

            countCompare();
            setCompareIndices([lc, rc]);
            playSound(arr[lc], 'sine', lc);
            if (!(await wait(0.4))) return;

            let child = rc;
            let childK = currK - 2;
            if (arr[lc] > arr[rc]) {
                child = lc;
                childK = currK - 1;
            }

            countCompare();
            setCompareIndices([curr, child]);
            playSound(arr[curr], 'sine', curr);
            if (!(await wait(0.4))) return;

            if (arr[curr] >= arr[child]) {
                break;
            }

            // Swap parent and child
            let temp = arr[curr];
            arr[curr] = arr[child];
            arr[child] = temp;
            countSwap();

            setCompareIndices([]);
            setSwapIndices([curr, child]);
            setArray([...arr]);
            playSound(arr[curr], 'triangle', curr);
            if (!(await wait(0.4))) return;
            setSwapIndices([]);

            curr = child;
            currK = childK;
        }
    };

    const trinkle = async () => {
        let heapIdx = heaps.length - 1;
        let currK = heaps[heapIdx].order;
        let currR = heaps[heapIdx].rootIndex;

        while (heapIdx > 0) {
            if (!sortingRef.current) return;

            let prevR = heaps[heapIdx - 1].rootIndex;
            let prevK = heaps[heapIdx - 1].order;

            countCompare();
            setCompareIndices([currR, prevR]);
            playSound(arr[currR], 'sine', currR);
            if (!(await wait(0.4))) return;

            if (arr[prevR] > arr[currR]) {
                let swapWithPrev = true;
                if (currK >= 2) {
                    let rc = currR - 1;
                    let lc = currR - 1 - leo[currK - 2];
                    if (arr[prevR] <= arr[lc] || arr[prevR] <= arr[rc]) {
                        swapWithPrev = false;
                    }
                }

                if (swapWithPrev) {
                    let temp = arr[currR];
                    arr[currR] = arr[prevR];
                    arr[prevR] = temp;
                    countSwap();

                    setCompareIndices([]);
                    setSwapIndices([currR, prevR]);
                    setArray([...arr]);
                    playSound(arr[currR], 'triangle', currR);
                    if (!(await wait(0.4))) return;
                    setSwapIndices([]);

                    currR = prevR;
                    currK = prevK;
                    heapIdx--;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        await siftDown(currR, currK);
    };

    // Phase 1: Build Leonardo Heaps (Growing)
    setDescription({ text: "Building Leonardo Heaps", type: "TARGET" });
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;

        const numHeaps = heaps.length;
        if (numHeaps >= 2 && heaps[numHeaps - 1].order + 1 === heaps[numHeaps - 2].order) {
            // Merge last two heaps and the new element into a single heap of order order+1
            heaps.pop();
            const prevHeap = heaps.pop();
            heaps.push({
                order: prevHeap.order + 1,
                rootIndex: i
            });
        } else {
            // Create a new heap of order 1 or 0
            if (numHeaps >= 1 && heaps[numHeaps - 1].order === 1) {
                heaps.push({
                    order: 0,
                    rootIndex: i
                });
            } else {
                heaps.push({
                    order: 1,
                    rootIndex: i
                });
            }
        }

        updateColors();
        setArray([...arr]);
        setCompareIndices([i]);
        playSound(arr[i], 'sine', i);
        if (!(await wait(0.4))) return false;
        setCompareIndices([]);

        // Trinkle to restore heap top sorted order
        await trinkle();
    }

    // Phase 2: Shrink Heaps (Extracting Max)
    setDescription({ text: "Extracting elements", type: "INFO" });
    const sortedIdxs = [];

    for (let i = n - 1; i >= 0; i--) {
        if (!sortingRef.current) return false;

        sortedIdxs.push(i);
        setSortedIndices([...sortedIdxs]);

        const currentHeap = heaps.pop();
        if (currentHeap.order < 2) {
            // Nothing to split, heap order 1 or 0 is already single element
            updateColors();
            playSound(arr[i], 'triangle', i);
            if (!(await wait(0.4))) return false;
        } else {
            // Split order k heap into its two sub-heaps: order k-1 and k-2
            const k = currentHeap.order;
            const r = currentHeap.rootIndex;

            const leftRoot = r - 1 - leo[k - 2];
            const rightRoot = r - 1;

            heaps.push({
                order: k - 1,
                rootIndex: leftRoot
            });
            heaps.push({
                order: k - 2,
                rootIndex: rightRoot
            });

            updateColors();
            setDescription({ text: "Splitting heap", type: "TARGET" });
            if (!(await wait(0.4))) return false;

            // Re-heapify and sort roots after split
            // First trinkle left child, then right child
            const savedHeaps = [...heaps];

            // Trinkle left child
            heaps = savedHeaps.slice(0, savedHeaps.length - 1);
            await trinkle();

            // Trinkle right child
            heaps = [...savedHeaps];
            await trinkle();
        }
    }

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
