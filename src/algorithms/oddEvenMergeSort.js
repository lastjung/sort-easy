export const oddEvenMergeSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setGroupIndices,
    setDescription,
    playSound,
    wait,
    sortingRef,
    countCompare,
    countSwap,
    msg
}) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = [COLORS.GROUP_PALETTE[2], COLORS.GROUP_PALETTE[4], COLORS.GROUP_PALETTE[0], COLORS.GROUP_PALETTE[3]];
    const completedBlocks = [];

    const paintBlocks = () => {
        const groups = {};
        const blocks = [...completedBlocks].sort((a, b) => a.low - b.low);
        for (let b = 0; b < blocks.length; b++) {
            const color = palette[b % palette.length];
            for (let i = blocks[b].low; i < Math.min(blocks[b].low + blocks[b].cnt, n); i++) {
                groups[i] = color;
            }
        }
        setGroupIndices(groups);
    };

    const clearBlocksInRange = (low, cnt) => {
        for (let i = completedBlocks.length - 1; i >= 0; i--) {
            const block = completedBlocks[i];
            if (block.low >= low && block.low + block.cnt <= low + cnt) {
                completedBlocks.splice(i, 1);
            }
        }
    };

    const compareSwap = async (i, j) => {
        if (i >= n || j >= n || !sortingRef.current) return true;
        setCompareIndices([i, j]);
        setSwapIndices([]);
        countCompare();
        setDescription(msg.COMPARE);
        playSound(arr[i], 'sine', i);
        if (!(await wait(1))) return false;

        if (arr[i] > arr[j]) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setArray([...arr]);
            setCompareIndices([]);
            setSwapIndices([i, j]);
            setDescription(msg.SWAP);
            countSwap();
            playSound(arr[i], 'triangle', i);
            if (!(await wait(1))) return false;
            setSwapIndices([]);
        }

        setCompareIndices([]);
        return true;
    };

    const oddEvenMerge = async (lo, cnt, step) => {
        if (!sortingRef.current) return false;
        const doubleStep = step * 2;

        if (doubleStep < cnt) {
            if (!(await oddEvenMerge(lo, cnt, doubleStep))) return false;
            if (!(await oddEvenMerge(lo + step, cnt, doubleStep))) return false;
            for (let i = lo + step; i + step < lo + cnt; i += doubleStep) {
                if (!(await compareSwap(i, i + step))) return false;
            }
        } else {
            if (!(await compareSwap(lo, lo + step))) return false;
        }

        return true;
    };

    const oddEvenMergeSortRecursive = async (lo, cnt, depth = 0) => {
        if (!sortingRef.current) return false;
        if (cnt <= 1) return true;

        const half = Math.floor(cnt / 2);
        setDescription({ text: `${depth === 0 ? 'Global Network' : `Sub-Network ${depth}`} [${lo}-${Math.min(lo + cnt - 1, n - 1)}]`, type: 'TARGET' });
        if (!(await wait(0.35))) return false;

        if (!(await oddEvenMergeSortRecursive(lo, half, depth + 1))) return false;
        if (!(await oddEvenMergeSortRecursive(lo + half, half, depth + 1))) return false;

        clearBlocksInRange(lo, cnt);
        paintBlocks();
        if (!(await oddEvenMerge(lo, cnt, 1))) return false;

        const actualCnt = Math.min(cnt, n - lo);
        if (actualCnt > 0) {
            completedBlocks.push({ low: lo, cnt: actualCnt });
            paintBlocks();
        }
        return true;
    };

    const nextPowerOfTwo = (value) => {
        let power = 1;
        while (power < value) power *= 2;
        return power;
    };

    setSortedIndices([]);
    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    if (!(await oddEvenMergeSortRecursive(0, nextPowerOfTwo(n), 0))) return false;
    if (!sortingRef.current) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
