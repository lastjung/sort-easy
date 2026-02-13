
export const shellSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setSortedIndices([]);
    setGroupIndices({});

    const paintGroupsByCount = (groupCount, colorSequence = null) => {
        const groups = {};
        const safeCount = Math.max(1, Math.min(groupCount, n));
        const blockSize = Math.ceil(n / safeCount);
        let colorIndex = 0;
        for (let start = 0; start < n; start += blockSize) {
            const end = Math.min(start + blockSize, n);
            const color = colorSequence
                ? colorSequence[colorIndex % colorSequence.length]
                : palette[colorIndex % palette.length];
            for (let idx = start; idx < end; idx++) {
                groups[idx] = color;
            }
            colorIndex++;
        }
        setGroupIndices(groups);
    };

    // Graphics-only divide preview: split once into 2 groups, then proceed.
    paintGroupsByCount(2);
    setDescription({ ...(msg.GAP || {}), text: 'Divide Preview: 2 groups' });
    if (!(await wait(1.0))) return false;

    let gapPass = 0;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        if (gapPass === 1) {
            const zigzagFour = [palette[0], palette[1], palette[0], palette[1]];
            paintGroupsByCount(4, zigzagFour);
            setDescription({ ...(msg.GAP || {}), text: 'Divide Preview: 4 groups (green/pink zigzag)' });
            if (!(await wait(1.0))) break;
        }

        if (gapPass === 2) {
            const zigzagEight = [palette[0], palette[1], palette[0], palette[1], palette[0], palette[1], palette[0], palette[1]];
            paintGroupsByCount(8, zigzagEight);
            setDescription({ ...(msg.GAP || {}), text: 'Divide Preview: 8 groups' });
            if (!(await wait(1.0))) break;
        }

        setDescription(msg.GAP);
        if (!(await wait(1.5))) break; // Setup 1.5
        for (let i = gap; i < n; i++) {
            if (!sortingRef.current) break;
            let temp = arr[i];
            let j = i;
            setGoodIndices([i]);
            while (j >= gap) {
                setCompareIndices([j, j - gap]);
                countCompare();
                setDescription(msg.COMPARE);
                playSound(200 + arr[j - gap] * 5, 'sine');
                if (!(await wait(1))) break; // Compare 1.0

                if (arr[j - gap] <= temp) {
                    break;
                }

                arr[j] = arr[j - gap];
                countSwap();
                setArray([...arr]);
                setDescription(msg.SWAP);
                playSound(100 + arr[j] * 5, 'sawtooth');
                setSwapIndices([j, j - gap]);
                if (!(await wait(1))) break; // Action 1.0
                const nextJ = j - gap;
                if (nextJ >= gap) {
                    setGoodIndices([]);
                    // Reverse-wave cue shares SWAP(red) color with the same pair style.
                    setSwapIndices([nextJ, nextJ - gap]);
                    setDescription({ ...(msg.SWAP || {}), text: 'Reverse wave...' });
                    if (!(await wait(0.35))) break;
                }
                setSwapIndices([]);

                j = nextJ;
            }
            arr[j] = temp;
            setArray([...arr]);
            if (j !== i) {
                countSwap();
                setSwapIndices([j, i]);
                playSound(600, 'square');
                if (!(await wait(1))) break; // Action 1.0
            } else {
                setSwapIndices([]);
            }
            if (!(await wait(0.5))) break; // Outro 0.5
        }
        gapPass++;
    }
    
    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription(msg.FINISHED || "Shell Sort Completed!");
    return true;
};
