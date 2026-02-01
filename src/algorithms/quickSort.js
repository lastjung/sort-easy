
export const quickSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setPivotOrders, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    let sortedIndices = [];
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;
    let currentGroups = {};
    let currentPivotOrders = {};
    let groupCounter = 0;
    let foundPivotCount = 0;

    const greenWall = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';

    // 초기 상태
    for (let i = 0; i < n; i++) currentGroups[i] = palette[0];
    setGroupIndices({...currentGroups});

    const partition = async (low, high) => {
        let pivotValue = arr[high];
        // 1. 현재 선택된 피벗은 보라색(TARGET/GOOD)으로 강조
        setGoodIndices([high]); 
        
        setDescription({ type: 'INFO', text: `Finding the spot for [${pivotValue}]...` });
        if (!(await wait(1.5))) return -1;
        
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (!sortingRef.current) return -1;
            setCompareIndices([j]); 
            
            countCompare();
            setDescription({ type: 'COMPARE', text: `Comparing ${arr[j]} with Pivot ${pivotValue}` });
            playSound(300 + arr[j] * 5, 'sine');
            if (!(await wait(1.0))) break;

            if (arr[j] < pivotValue) {
                i++;
                setSwapIndices([i, j]); // 일반 스왑은 빨간색
                setDescription({ type: 'SWAP', text: `Moving smaller element...` });
                playSound(150, 'sawtooth');
                countSwap();
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                if (!(await wait(1.0))) break;
                setSwapIndices([]);
            }
        }

        if (!sortingRef.current) return -1;

        // [결정적 순간: 피벗이 제자리를 찾음]
        const pi = i + 1;
        
        // 1단계: 보라색(GOOD)으로 번쩍이며 자리 바꾸기
        // 사용자 요청: "보라색으로 변경(스왑)되고"
        setSwapIndices([]); // 빨간색 제거
        setGoodIndices([pi, high]); // 목표 지점과 피벗을 모두 보라색으로!
        
        setDescription({ type: 'TARGET', text: `Spot Found! [${pivotValue}] belongs here.` });
        countSwap();
        [arr[pi], arr[high]] = [arr[high], arr[pi]];
        setArray([...arr]);
        playSound(600, 'sine');
        
        // 보라색 상태를 충분히 보여줌
        if (!(await wait(1.5))) return -1;

        // 2단계: 즉시 녹색(Green)으로 승격 및 번호 부여
        foundPivotCount++;
        currentPivotOrders[pi] = foundPivotCount;
        setPivotOrders({...currentPivotOrders});
        
        sortedIndices.push(pi);
        setSortedIndices([...sortedIndices]);
        
        currentGroups[pi] = greenWall; // 초록색 벽 고정
        setGroupIndices({...currentGroups});
        setGoodIndices([]); // 보라색 해제
        
        if (!(await wait(0.8))) return -1;

        // 3단계: 이제 이 벽을 기준으로 좌우 팀 분리 (Gap 생성)
        groupCounter++;
        const leftColor = palette[groupCounter % palette.length];
        groupCounter++;
        const rightColor = palette[groupCounter % palette.length];

        for (let k = low; k <= high; k++) {
            if (!sortedIndices.includes(k)) {
                currentGroups[k] = (k < pi) ? leftColor : rightColor;
            } else {
                currentGroups[k] = greenWall;
            }
        }
        
        setGroupIndices({...currentGroups});
        setDescription({ type: 'DIVIDE', text: `Pivot #${foundPivotCount} Fixed. Now Conquer!` });
        if (!(await wait(1.2))) return -1;

        return pi;
    };

    const qSort = async (low, high) => {
        if (low < high) {
            let pi = await partition(low, high);
            if (pi === -1) return;
            await qSort(low, pi - 1);
            await qSort(pi + 1, high);
        } else if (low === high) {
            if (!sortedIndices.includes(low)) {
                foundPivotCount++;
                currentPivotOrders[low] = foundPivotCount;
                setPivotOrders({...currentPivotOrders});
                sortedIndices.push(low);
                setSortedIndices([...sortedIndices]);
                currentGroups[low] = greenWall;
                setGroupIndices({...currentGroups});
                if (!(await wait(0.3))) return;
            }
        }
    };

    setDescription(msg.START);
    await qSort(0, n - 1);
    
    if (!sortingRef.current) return false;

    setGroupIndices({}); 
    setPivotOrders({});
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
