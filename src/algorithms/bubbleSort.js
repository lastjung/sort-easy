
export const bubbleSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');

    setSortedIndices([]); 
    setGroupIndices({});
    let newSortedIndices = []; 
  
    setDescription(msg.START);
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n - 1; i++) {
        if (!sortingRef.current) break;
  
        let swapped = false;
        const lastIdx = n - i - 1;

        // ========================================
        // 그룹 분리 시각화 (핑크: 미정렬, 초록: 정렬완료)
        // ========================================
        const groups = {};
        for (let k = 0; k < n; k++) {
            groups[k] = k < lastIdx ? COLORS.GROUP_PALETTE[1] : COLORS.GROUP_PALETTE[12]; 
        }
        setGroupIndices(groups);
  
        for (let j = 0; j < lastIdx; j++) {
            if (!sortingRef.current) break;
            
            // 1. Compare (Yellow)
            setCompareIndices([j, j + 1]);
            setSwapIndices([]);
            countCompare();
            setDescription(msg.COMPARE);
            playSound(arr[j], 'sine', j);
            if (!(await wait(1))) break;
  
            if (arr[j] > arr[j + 1]) {
                // 2. Swap (Red)
                setCompareIndices([]); 
                setSwapIndices([j, j + 1]); 
                setDescription(msg.SWAP);
                playSound(arr[j], 'triangle', j);
                
                countSwap();
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                
                setArray([...arr]); 
                swapped = true;
                if (!(await wait(1))) break;
                setSwapIndices([]);
            } else {
                if (!(await wait(0.5))) break;
            }
        }
        
        if (!sortingRef.current) break;
        
        if (!(await wait(1))) break;
        // Confirm Sorted (Green)
        newSortedIndices.push(lastIdx);
        setSortedIndices([...newSortedIndices]);
        setGoodIndices([]);
        
        playSound(arr[lastIdx], 'sine', lastIdx);
        if (!(await wait(0.5))) break; // Outro wait 0.5
        if (!swapped) {
            const remaining = [];
            for(let k=0; k < lastIdx; k++) remaining.push(k);
            setSortedIndices([...newSortedIndices, ...remaining]);
            break;
        }
    }
    if (!sortingRef.current) return false;

    setGroupIndices({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
