
export const heapSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
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
            countCompare();
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < n) {
            setCompareIndices([largest, right]);
            countCompare();
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            setSwapIndices([i, largest]);
            setDescription(`Swapping parent at position ${i + 1} with child at ${largest + 1}.`);
            countSwap();
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) return;
            setSwapIndices([]);
            await heapify(n, largest);
        }
    };

    setDescription("Creating Max Heap structure...");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!sortingRef.current) break;
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        if (!sortingRef.current) break;
        setSwapIndices([0, i]);
        setDescription(`Moving largest value to sorted position ${i + 1}.`);
        countSwap();
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        if (!(await wait(1.2))) break;
        
        sortedIndices.push(i);
        setSortedIndices([...sortedIndices]);
        setSwapIndices([]);
        await heapify(i, 0);
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription("Heap Sort Completed!");
    return true;
};
