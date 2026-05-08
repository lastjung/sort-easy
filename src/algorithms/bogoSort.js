export const bogoSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;

    setSortedIndices([]);
    setGoodIndices([]);
    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(0.5))) return false;

    const isSorted = async () => {
        for (let i = 0; i < n - 1; i++) {
            if (!sortingRef.current) return false;

            countCompare();
            setCompareIndices([i, i + 1]);
            
            // Ultra fast pitch play
            playSound(arr[i], 'sine', i);
            setDescription({ text: "Checking order...", type: "COMPARE" });
            
            // Speed up the order checking to make it highly snappy
            if (!(await wait(0.02))) return false;

            if (arr[i] > arr[i + 1]) {
                // Quick error flash
                setCompareIndices([]);
                setSwapIndices([i, i + 1]);
                setDescription({ text: "Out of order! Shuffling...", type: "SWAP" });
                playSound(arr[i], 'sawtooth', i);
                if (!(await wait(0.06))) return false;
                setSwapIndices([]);
                return false;
            }
        }
        return true;
    };

    while (sortingRef.current) {
        let sorted = await isSorted();
        if (!sortingRef.current) return false;
        if (sorted) {
            break;
        }

        // Fisher-Yates shuffle
        for (let i = n - 1; i > 0; i--) {
            if (!sortingRef.current) return false;
            const j = Math.floor(Math.random() * (i + 1));
            
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            countSwap();
        }

        setArray([...arr]);

        // Ultra fast flash array in hot pink during shuffle
        const shuffleGroups = {};
        for (let k = 0; k < n; k++) {
            shuffleGroups[k] = "#ff3366";
        }
        setGroupIndices(shuffleGroups);
        playSound(arr[0], 'triangle', 0);
        
        if (!(await wait(0.04))) return false;
        setGroupIndices({});
    }

    if (!sortingRef.current) return false;

    setGroupIndices({});
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
