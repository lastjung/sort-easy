export const mergeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let currentGroupColors = {}; 
    let sortedIndices = []; // 루프 중 완료된 인덱스를 추적하기 위해 선언
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setSortedIndices([]);
    setGroupIndices({});

    /**
     * [STEP 1: FULL EXPLOSION DIVIDE]
     * 정렬 시작 전, 모든 요소를 1~2개 단위로 완전히 분할합니다.
     */
    const runFullDivideVisualization = async () => {
        let currentQueue = [{ l: 0, r: n - 1 }];
        
        while (true) {
            let nextQueue = [];
            let levelColors = {};
            let canSplitFurther = false;

            for (let i = 0; i < currentQueue.length; i++) {
                const { l, r } = currentQueue[i];
                const color = palette[i % palette.length];
                for (let j = l; j <= r; j++) levelColors[j] = color;
                
                if (l < r) {
                    let m = Math.floor((l + r) / 2);
                    nextQueue.push({ l, r: m });
                    nextQueue.push({ l: m + 1, r });
                    if ((r - l + 1) > 1) canSplitFurther = true;
                } else {
                    nextQueue.push({ l, r });
                }
                
                // Tube Mode 가속을 위해 '진행 중'임을 알리는 가상 카운트
                countCompare(); 
            }

            currentGroupColors = {...levelColors};
            setGroupIndices({...currentGroupColors});
            setDescription({ ...msg.DIVIDE, text: `Dividing: ${currentQueue.length} Groups` });
            if (!(await wait(1.0))) return false;

            if (!canSplitFurther) break;
            currentQueue = nextQueue;
            
            const isAllSmall = currentQueue.every(q => (q.r - q.l + 1) <= 2);
            if (isAllSmall) {
                const finalColors = {};
                for (let i = 0; i < currentQueue.length; i++) {
                    const { l, r } = currentQueue[i];
                    for (let j = l; j <= r; j++) finalColors[j] = palette[i % palette.length];
                    countSwap(); // 가속 신호
                }
                currentGroupColors = {...finalColors};
                setGroupIndices({...currentGroupColors});
                if (!(await wait(1.0))) return false;
                break;
            }
        }
        return true;
    };

    /**
     * [STEP 2: RECONSTRUCT MERGE]
     * 분할된 상태에서 하나씩 합쳐나갑니다.
     */
    const merge = async (l, m, r) => {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = [...arr.slice(l, m + 1)];
        let R = [...arr.slice(m + 1, r + 1)];

        const mergeRange = [...Array(r - l + 1).keys()].map(x => x + l);
        setCompareIndices(mergeRange);
        setDescription(msg.MERGE);
        if (!(await wait(1))) return;

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (!sortingRef.current) return;
            
            setCompareIndices(mergeRange.filter(idx => idx >= k)); 
            setDescription(msg.COMPARE);
            countCompare();
            if (!(await wait(1.2))) break;

            if (L[i] <= R[j]) {
                arr[k] = L[i]; i++;
            } else {
                arr[k] = R[j]; j++;
            }
            
            // 병합 완료 시 이 영역의 색상(및 Divider)을 지워 하나로 합쳐진 느낌을 줌
            delete currentGroupColors[k];
            setGroupIndices({...currentGroupColors});

            setCompareIndices(mergeRange.filter(idx => idx > k)); 
            setSwapIndices([k]);
            setArray([...arr]);
            playSound(400, 'square');
            if (!(await wait(1.2))) break;
            
            setSwapIndices([]); 
            k++;
        }

        const finalize = async (list, pointer) => {
            while (pointer < list.length) {
                if (!sortingRef.current) break;
                arr[k] = list[pointer];
                setArray([...arr]);
                setSwapIndices([k]);
                delete currentGroupColors[k];
                setGroupIndices({...currentGroupColors});
                if (!(await wait(0.8))) break;
                setSwapIndices([]);
                pointer++; k++;
            }
        };

        await finalize(L, i);
        await finalize(R, j);
        
        setCompareIndices([]); 
        setSwapIndices([]);
    };

    const mSort = async (l, r) => {
        if (l < r) {
            let m = Math.floor((l + r) / 2);
            await mSort(l, m);
            await mSort(m + 1, r);
            await merge(l, m, r);
            
            // 병합이 완료된 이 구역은 이제 '현재 레벨에서 정렬됨' 상태입니다.
            // 이를 sortedIndices에 추가하여 Tube Mode 가속을 유도합니다.
            for (let x = l; x <= r; x++) {
                if (!sortedIndices.includes(x)) sortedIndices.push(x);
            }
            setSortedIndices([...sortedIndices]);
        }
    };

    setDescription(msg.START);
    
    // 먼저 가루가 되도록 분할!
    if (!(await runFullDivideVisualization())) return false;

    // 분할된 조각들을 하나씩 조립!
    await mSort(0, n - 1);
    
    if (!sortingRef.current) return false;

    setGroupIndices({}); 
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
