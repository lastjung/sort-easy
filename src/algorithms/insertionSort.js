
export const insertionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;
    
    setSortedIndices([]); 
    setGroupIndices({});
    
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        
        // ========================================
        // PHASE 1: 새 피벗 선택 및 분리 (갈라짐)
        // ========================================
        setGoodIndices([i]); 
        
        // 피벗(i)이 오른쪽 그룹에 있음 (아직 안 왔음)
        const splitGroups = {};
        for (let k = 0; k < n; k++) {
            splitGroups[k] = k < i ? palette[0] : palette[1];
        }
        setGroupIndices(splitGroups);
        setDescription(msg.PICK);
        
        // CSS 애니메이션(700ms) 완료 대기 (고정)
        await new Promise(r => setTimeout(r, 350));
        if (!sortingRef.current) break;
        if (!(await wait(0.5))) break;
        
        // ========================================
        // PHASE 2: 피벗이 왼쪽으로 합류 (완전히 옴)
        // ========================================
        const joinedGroups = {};
        for (let k = 0; k < n; k++) {
            joinedGroups[k] = k <= i ? palette[0] : palette[1];
        }
        setGroupIndices(joinedGroups);
        
        // CSS 애니메이션 완료 대기 (고정)
        await new Promise(r => setTimeout(r, 350));
        if (!sortingRef.current) break;
        
        // ========================================
        // PHASE 3: 정렬 진행 (갈라진 상태 유지)
        // ========================================
        let pivotPos = i; // 피벗의 현재 위치 추적
        let j = i - 1;
        
        while (j >= 0) {
            if (!sortingRef.current) break;
            
            // 비교: 피벗(보라색)만 표시, 노란색 없음
            setGoodIndices([pivotPos]);
            countCompare();
            setDescription(msg.COMPARE);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;
            
            if (arr[j] > arr[j + 1]) {
                // 스왑: 피벗(보라색) + 상대(초록색)
                setGoodIndices([pivotPos]); // 피벗 보라색 유지
                setSortedIndices([j]); // 스왑 상대 초록색
                setDescription(msg.SHIFT);
                playSound(150, 'sawtooth');
                countSwap();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                if (!(await wait(1))) break;
                
                // 피벗이 왼쪽으로 이동
                pivotPos = j;
                setSortedIndices([]); // 초록색 제거
                j--;
            } else { 
                setDescription(msg.INSERT); 
                break; 
            }
        }
        if (!sortingRef.current) break;
        
        // ========================================
        // PHASE 4: 현재 단계 완료 (갈라짐 닫기)
        // ========================================
        setCompareIndices([]); 
        setSwapIndices([]);
        setGroupIndices({}); // 갈라짐 닫기
        
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);
        setGoodIndices([]);
        
        playSound(600, 'square');
    }
    
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setGroupIndices({});
    setDescription(msg.FINISHED);
    return true;
};
