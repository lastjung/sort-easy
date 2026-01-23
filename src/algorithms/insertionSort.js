
export const insertionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef }) => {
    const arr = [...array];
    const n = arr.length;
    setGoodIndices([1]);
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        setGoodIndices([i]); 
        setDescription(`Setting position ${i + 1} as the sorting target (Purple).`);
        if (!(await wait(1.2))) break; 
        
        let j = i - 1;
        while (j >= 0) {
            if (!sortingRef.current) break;
            setCompareIndices([j, j + 1]);
            setDescription(`Comparing position ${j + 1} and ${j + 2}... (Yellow)`);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1.5))) break;
            
            if (arr[j] > arr[j + 1]) {
                setCompareIndices([]); setSwapIndices([j, j + 1]);
                setDescription(`Swapping position ${j + 1} and ${j + 2} (Red).`);
                playSound(150, 'sawtooth');
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                if (!(await wait(1.5))) break;
                setSwapIndices([]); 
                j--;
            } else { 
                setDescription(`Position ${j + 2} is the correct spot for insertion.`); 
                break; 
            }
        }
        if (!sortingRef.current) break;
        setCompareIndices([]); setSwapIndices([]);
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription(`Position ${i + 1} sorted. Preparing position ${i + 2} (Purple-Purple).`);
            if (!(await wait(1))) break;
        }
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        if (i + 1 < n) { 
            setGoodIndices([i + 1]); 
            setDescription(`Sorted positions: 1 to ${i + 1}. Waiting for next target.`); 
            if (!(await wait(1))) break; 
        } else { 
            setGoodIndices([]); 
        }
        playSound(600, 'square');
    }
    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription("Insertion Sort Completed!");
    return true;
};
