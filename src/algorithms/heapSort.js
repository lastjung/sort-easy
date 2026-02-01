
export const heapSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]);
    let sortedIndices = [];

    const heapify = async (n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            setCompareIndices([largest, left]);
            setDescription(msg.COMPARE);
            countCompare();
            if (!(await wait(1))) return; // Compare 1.0
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < n) {
            setCompareIndices([largest, right]);
            setDescription(msg.COMPARE);
            countCompare();
            if (!(await wait(1))) return; // Compare 1.0
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            setSwapIndices([i, largest]);
            setDescription(msg.SWAP);
            countSwap();
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) return; // Action 1.0
            setSwapIndices([]);
            await heapify(n, largest);
        }
    };

    setDescription(msg.HEAPIFY);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!sortingRef.current) break;
        await heapify(n, i);
    }
    if (!(await wait(0.5))) return false; // Outro 0.5 

    for (let i = n - 1; i > 0; i--) {
        if (!sortingRef.current) break;
        
        setSwapIndices([0, i]);
        setDescription(msg.SWAP);
        countSwap();
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        if (!(await wait(1))) break; // Action 1.0
        
        sortedIndices.push(i);
        setSortedIndices([...sortedIndices]);
        setSwapIndices([]);
        if (!(await wait(0.5))) break; // Outro 0.5
        await heapify(i, 0);
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
