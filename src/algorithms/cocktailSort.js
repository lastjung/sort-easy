
export const cocktailSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap }) => {
    const arr = [...array];
    setSortedIndices([]);
    let start = 0, end = arr.length - 1, swapped = true;
    let sortedIndices = [];
    while (swapped) {
        swapped = false;
        setDescription("Bubbling forward through unsorted positions...");
        for (let i = start; i < end; ++i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            countCompare(); // Increment comparison count
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); // Increment swap count
                swapped = true; if (!(await wait(1))) break;
            } else if (!(await wait(0.5))) break;
        }
        if (!swapped) break;
        swapped = false;
        sortedIndices.push(end);
        setSortedIndices([...sortedIndices]);
        end--;
        setDescription("Bubbling backward through unsorted positions...");
        for (let i = end - 1; i >= start; --i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            countCompare(); // Increment comparison count
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); // Increment swap count
                swapped = true; if (!(await wait(1))) break;
            } else if (!(await wait(0.5))) break;
        }
        sortedIndices.push(start);
        setSortedIndices([...sortedIndices]);
        start++;
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(arr.length).keys()]);
    setDescription("Cocktail Sort Completed!");
    return true;
};
