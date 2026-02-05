export const selectionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;
    
    let sortedCount = 0;
    setSortedIndices([]); 
    setGroupIndices({});
    setGoodIndices([]);
    setCompareIndices([]);
  
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
  
        // ========================================
        // 앞(초록) 뒤(분홍) 구분 설정
        // ========================================
        const divideGroups = {};
        for (let k = 0; k < n; k++) {
            divideGroups[k] = k < i ? palette[0] : palette[1]; // 앞: palette[0], 뒤: palette[1](분홍)
        }
        setGroupIndices(divideGroups);
        
        // 정렬된 영역 초록색
        let sortedRange = [];
        for (let k = 0; k < sortedCount; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);

        // ========================================
        // PHASE 1: 스캔하여 최솟값 찾기
        // ========================================
        let minIndex = i;
        setDescription(msg.SCAN);
        
        for (let j = i; j < n; j++) {
            if (!sortingRef.current) break;

            // 노란색: 스캔, 초록색: 최솟값
            setCompareIndices([j]); // 스캔 중: 노란색
            setSortedIndices([minIndex, ...sortedRange]); // 최솟값 + 정렬된 영역: 초록색
            
            countCompare();
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(1))) break;

            if (arr[j] < arr[minIndex]) {
                // 새 최솟값 발견!
                minIndex = j;
                setSortedIndices([minIndex, ...sortedRange]); // 새 최솟값: 초록색
                setDescription(msg.NEW_MIN); 
                playSound(800, 'triangle'); 
                if (!(await wait(1))) break;
                setDescription(msg.SCAN);
            }
        }
        
        if (!sortingRef.current) break;
        setCompareIndices([]); // 스캔 종료

        // ========================================
        // PHASE 2: 최솟값(초록)과 첫 셀 교환
        // ========================================
        if (minIndex !== i) {
            setSortedIndices([minIndex, ...sortedRange]);
            setDescription(msg.SWAP);
            playSound(150, 'sawtooth'); 
            countSwap();
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) break;
        }

        // ========================================
        // PHASE 3: 정렬된 영역 확장 + 갈라짐
        // ========================================
        sortedCount++;
        
        // 새 갈라짐 위치
        const newDivideGroups = {};
        for (let k = 0; k < n; k++) {
            newDivideGroups[k] = k < sortedCount ? palette[0] : palette[1];
        }
        setGroupIndices(newDivideGroups);
        
        await new Promise(r => setTimeout(r, 350));
        if (!sortingRef.current) break;
        
        // 정렬된 영역 표시 (초록색)
        sortedRange = [];
        for (let k = 0; k < sortedCount; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        
        playSound(600, 'square');
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGroupIndices({});
    setCompareIndices([]);
    setDescription(msg.FINISHED);
    return true;
};
