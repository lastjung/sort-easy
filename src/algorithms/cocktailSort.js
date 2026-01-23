
export const cocktailSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef }) => {
    const arr = [...array];
    let start = 0, end = arr.length - 1, swapped = true;
    let sortedIndices = [];
    while (swapped) {
        swapped = false;
        setDescription("Bubbling forward through unsorted positions...");
        for (let i = start; i < end; ++i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
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
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                swapped = true; if (!(await wait(1))) break;
            } else if (!(await wait(0.5))) break;
        }
        sortedIndices.push(start);
        setSortedIndices([...sortedIndices]);
        start++;
    }
    setSortedIndices([...Array(arr.length).keys()]);
    setDescription("Cocktail Sort Completed!");
    return true;
};
