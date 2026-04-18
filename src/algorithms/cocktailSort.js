
export const cocktailSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');

    setSortedIndices([]);
    setGroupIndices({});
    let start = 0, end = n - 1, swapped = true;
    let sortedIndices = [];

    const updateGroups = (s, e) => {
        const groups = {};
        for (let k = 0; k < n; k++) {
            if (k < s || k > e) {
                groups[k] = COLORS.GROUP_PALETTE[12]; // 정렬완료 (초록)
            } else {
                groups[k] = COLORS.GROUP_PALETTE[1];  // 미정렬 (핑크)
            }
        }
        setGroupIndices(groups);
    };

    while (swapped) {
        swapped = false;
        setDescription(msg.FORWARD);
        updateGroups(start, end);
        if (!(await wait(0.5))) break;
        
        for (let i = start; i < end; ++i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            setDescription(msg.COMPARE);
            countCompare(); 
            playSound(arr[i], 'sine', i);
            if (!(await wait(1))) break; // Compare 1.0
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); 
                setDescription(msg.SWAP);
                playSound(arr[i], 'triangle', i);
                swapped = true; 
                if (!(await wait(1))) break; // Action 1.0
                setSwapIndices([]);
            }
        }
        if (!swapped) break;
        swapped = false;
        sortedIndices.push(end);
        setSortedIndices([...sortedIndices]);
        playSound(arr[end], 'sine', end);
        end--;
        updateGroups(start, end);
        if (!(await wait(0.2))) break;

        setDescription(msg.BACKWARD);
        if (!(await wait(0.5))) break;
        
        for (let i = end - 1; i >= start; --i) {
            if (!sortingRef.current) break;
            setCompareIndices([i, i + 1]);
            setDescription(msg.COMPARE);
            countCompare(); 
            playSound(arr[i], 'sine', i);
            if (!(await wait(1))) break; // Compare 1.0
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                setArray([...arr]); setSwapIndices([i, i + 1]);
                countSwap(); 
                setDescription(msg.SWAP);
                playSound(arr[i], 'triangle', i);
                swapped = true; 
                if (!(await wait(1))) break; // Action 1.0
                setSwapIndices([]);
            }
        }
        sortedIndices.push(start);
        setSortedIndices([...sortedIndices]);
        playSound(arr[start], 'sine', start);
        start++;
        updateGroups(start, end);
        if (!(await wait(0.2))) break;
    }
    
    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription("Cocktail Sort Completed!");
    return true;
};
