export const bubbleSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    let newSortedIndices = []; 
  
    setDescription("버블 정렬을 시작합니다.");
    setSortedIndices([]);
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n - 1; i++) {
        if (!sortingRef.current) break;
  
        let swapped = false;
        // 이번 라운드에서 정렬될 끝 지점을 보라색으로 마킹
        const lastIdx = n - i - 1;
  
        for (let j = 0; j < lastIdx; j++) {
            if (!sortingRef.current) break;
            
            // 1. 비교 (노란색)
            setCompareIndices([j, j + 1]);
            setSwapIndices([]);
            setDescription(`${j + 1}번과 ${j + 2}번 막대 비교 중... (노란색)`);
            playSound(200 + arr[j] * 5, 'sine');
            if (!(await wait(1))) break;
  
            if (arr[j] > arr[j + 1]) {
                // 2. 교환 (빨간색)
                setCompareIndices([]); 
                setSwapIndices([j, j + 1]); 
                setDescription(`${j + 1}번이 더 큽니다. 교환! (빨간색)`);
                playSound(100 + arr[j] * 5, 'sawtooth');
                
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                
                setArray([...arr]); 
                swapped = true;
                if (!(await wait(1))) break;
                setSwapIndices([]);
            } else {
                // 그대로 유지 (노란색 유지하며 대기)
                setDescription(`${j + 1}번이 작거나 같으므로 유지합니다.`);
                if (!(await wait(1))) break;
            }
        }
        
        if (!sortingRef.current) break;
        
        // --- 버블 정렬 바통 터치 연출 ---
        // 확정될 위치(lastIdx)를 보라색으로 강조
        setGoodIndices([lastIdx]);
        setDescription(`${lastIdx + 1}번 위치에 가장 큰 값이 안착했습니다 (보라색).`);
        if (!(await wait(1))) break;

        // 녹색으로 확정
        newSortedIndices.push(lastIdx);
        setSortedIndices([...newSortedIndices]);
        setGoodIndices([]);
        
        playSound(600, 'square');
        if (!swapped) {
            // 더 이상 교환이 없으면 나머지는 모두 자동 정렬 완료
            const remaining = [];
            for(let k=0; k < lastIdx; k++) remaining.push(k);
            setSortedIndices([...newSortedIndices, ...remaining]);
            break;
        }
    }
    setSortedIndices([...Array(n).keys()]);
    setDescription("모든 정렬이 완료되었습니다!");
    return true;
};
  
export const selectionSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    let newSortedIndices = []; 
  
    setDescription("선택 정렬을 시작합니다.");
    setSortedIndices([]);
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
  
        let minIndex = i;
        // 1. 타겟 선정 (보라색)
        setGoodIndices([i]); 
        setDescription(`${i + 1}번 자리에 들어갈 가장 작은 숫자를 찾습니다 (보라색).`);
        if (!(await wait(1.5))) break;
  
        for (let j = i + 1; j < n; j++) {
            if (!sortingRef.current) break;
  
            // 2. 탐색 (노란색 스캐너)
            setCompareIndices([j]); 
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(0.5))) break;
  
            if (arr[j] < arr[minIndex]) {
                // 새로운 최소값 발견 (빨간색)
                minIndex = j;
                setDescription(`새로운 최소값 발견: 현재 ${j + 1}번 막대가 가장 작습니다! (빨간색)`); 
                setSwapIndices([minIndex]); 
                playSound(800, 'triangle'); 
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }
        
        if (!sortingRef.current) break;
        setCompareIndices([]);
  
        // 3. 교환 (빨간색)
        if (minIndex !== i) {
            setDescription(`${i + 1}번 자리 막대와 최소값 ${minIndex + 1}번 막대 교환 (빨간색).`);
            setSwapIndices([i, minIndex]); 
            playSound(150, 'sawtooth'); 
            
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
            
            setArray([...arr]);
            if (!(await wait(1.5))) break;
            setSwapIndices([]);
        } else {
             setDescription(`${i + 1}번 막대가 이미 이 구역에서 가장 작습니다.`);
             if (!(await wait(1))) break;
        }
  
        // --- 선택 정렬 바통 터치 연출 ---
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription("현재 위치 확정 후 다음 타겟 준비 (보라-보라)");
            if (!(await wait(1))) break;
        }

        // 녹색 확정
        newSortedIndices.push(i);
        setSortedIndices([...newSortedIndices]);
        
        if (i + 1 < n) {
            setGoodIndices([i + 1]);
            if (!(await wait(1))) break;
        } else {
            setGoodIndices([]);
        }
        
        playSound(600, 'square');
    }
    setSortedIndices([...Array(n).keys()]);
    setDescription("모든 정렬이 완료되었습니다!");
    return true;
};

export const insertionSort = async ({
    array,
    setArray,
    setCompareIndices,
    setSwapIndices,
    setGoodIndices,
    setSortedIndices,
    setDescription,
    playSound,
    wait,
    sortingRef
  }) => {
    const arr = [...array];
    const n = arr.length;
    
    // 초기 시작: 1번 위치(인덱스 0)는 자동 정렬된 상태
    setGoodIndices([1]);
    
    for (let i = 1; i < n; i++) {
        if (!sortingRef.current) break;
        
        // 보라색 고정 마커: 기준점 노출
        setGoodIndices([i]); 
        setDescription(`${i + 1}번 막대를 정렬 기준(보라색)으로 선정`);
        if (!(await wait(1.2))) break; 
        
        let j = i - 1;
        
        // "역방향 버블링" 시작
        while (j >= 0) {
            if (!sortingRef.current) break;

            // 1. 비교 (노란색)
            setCompareIndices([j, j + 1]);
            setDescription(`${j + 1}번과 ${j + 2}번 막대 비교 중... (노란색)`);
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1.5))) break;

            if (arr[j] > arr[j + 1]) {
                // 2. 위치 교환(스왑) (빨간색)
                setCompareIndices([]);
                setSwapIndices([j, j + 1]);
                setDescription(`${j + 1}번과 ${j + 2}번 막대 교환 (빨간색)`);
                playSound(150, 'sawtooth');
                
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
                
                if (!(await wait(1.5))) break;
                setSwapIndices([]); 
                j--;
            } else {
                setDescription(`${j + 2}번 위치가 적절한 삽입 위치입니다.`);
                break;
            }
        }

        if (!sortingRef.current) break;

        // --- 바통 터치 연출 (보라, 보라 => 녹색, 보라) ---
        setCompareIndices([]);
        setSwapIndices([]);
        
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription(`현재(${i + 1}번) 완료 및 다음(${i + 2}번) 기준점 준비 (보라-보라)`);
            if (!(await wait(1))) break;
        }

        // 현재 구역 녹색 확정
        let sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        setSortedIndices(sortedRange);

        if (i + 1 < n) {
            setGoodIndices([i + 1]);
            setDescription(`정렬 확인: 1~${i + 1}번 녹색 확정, ${i + 2}번 기준점 대기.`);
            if (!(await wait(1))) break;
        } else {
            setGoodIndices([]);
        }

        playSound(600, 'square');
    }
    
    setSortedIndices([...Array(n).keys()]);
    setGoodIndices([]);
    setDescription("모든 정렬이 완료되었습니다!");
    return true;
};
