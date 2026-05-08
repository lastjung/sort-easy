export const patienceSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const originalArray = [...array];
    const n = originalArray.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setSortedIndices([]);
    setGoodIndices([]);
    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    setDescription({ text: "Distributing into piles", type: "TARGET" });
    const piles = [];
    let currentArr = [...originalArray];

    const getPileTopIndex = (pileIdx) => {
        let index = 0;
        for (let p = 0; p < pileIdx; p++) {
            index += piles[p].cards.length;
        }
        return index + piles[pileIdx].cards.length - 1;
    };

    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;
        
        let val = originalArray[i];
        let foundPileIdx = -1;
        let currentElementIdx = i; // The unprocessed element is at index `i` in currentArr

        for (let p = 0; p < piles.length; p++) {
            if (!sortingRef.current) return false;
            
            let topIdx = getPileTopIndex(p);
            countCompare();
            setCompareIndices([currentElementIdx, topIdx]);
            playSound(piles[p].topValue, 'sine', topIdx);
            
            if (!(await wait(0.5))) return false;

            if (val <= piles[p].topValue) {
                foundPileIdx = p;
                break;
            }
        }

        if (foundPileIdx === -1) {
            foundPileIdx = piles.length;
            piles.push({ cards: [], topValue: val, topIndex: i });
        }

        // Place on top of the pile
        piles[foundPileIdx].cards.push({ val, originalIndex: i });
        piles[foundPileIdx].topValue = val;

        // Reconstruct currentArr: [ ...flattened_piles, ...unprocessed ]
        const nextArr = [];
        const groups = {};
        let idx = 0;
        piles.forEach((pile, pIdx) => {
            pile.cards.forEach(card => {
                nextArr.push(card.val);
                groups[idx] = palette[pIdx % palette.length];
                idx++;
            });
        });
        for (let k = i + 1; k < n; k++) {
            nextArr.push(originalArray[k]);
        }

        currentArr = nextArr;
        setArray([...currentArr]);
        setGroupIndices({ ...groups });
        
        // Highlight the newly placed card in its pile position
        let newPlacedIdx = idx - 1;
        setGoodIndices([newPlacedIdx]);
        playSound(val, 'triangle', newPlacedIdx);
        if (!(await wait(0.5))) return false;
        setGoodIndices([]);
    }
    setCompareIndices([]);
    setGoodIndices([]);

    setDescription({ text: "Merging piles", type: "INFO" });
    if (!(await wait(1))) return false;

    let writeIdx = 0;
    const sortedElements = [];
    const sortedGroups = {};

    const getMergePileTopIndex = (pileIdx) => {
        let index = writeIdx;
        for (let p = 0; p < pileIdx; p++) {
            index += piles[p].cards.length;
        }
        return index + piles[pileIdx].cards.length - 1;
    };

    while (writeIdx < n) {
        if (!sortingRef.current) return false;

        // Find pile with minimum top card
        let minVal = Infinity;
        let minPileIdx = -1;

        // Highlight all active pile tops in yellow
        const activeTops = [];
        for (let p = 0; p < piles.length; p++) {
            if (piles[p].cards.length > 0) {
                activeTops.push(getMergePileTopIndex(p));
            }
        }
        
        setCompareIndices(activeTops);
        setDescription({ text: "Scanning pile tops", type: "INFO" });
        if (!(await wait(0.5))) return false;

        for (let p = 0; p < piles.length; p++) {
            if (piles[p].cards.length > 0) {
                let topCard = piles[p].cards[piles[p].cards.length - 1];
                if (topCard.val < minVal) {
                    minVal = topCard.val;
                    minPileIdx = p;
                }
            }
        }

        let sourceIdx = getMergePileTopIndex(minPileIdx);

        // Highlight source and target
        setCompareIndices([sourceIdx]);
        setSwapIndices([writeIdx]);
        setDescription({ text: "Extracting min: " + minVal, type: "SWAP" });
        playSound(minVal, 'sine', sourceIdx);
        if (!(await wait(0.6))) return false;

        // Pop from min pile
        piles[minPileIdx].cards.pop();
        if (piles[minPileIdx].cards.length > 0) {
            let newTop = piles[minPileIdx].cards[piles[minPileIdx].cards.length - 1];
            piles[minPileIdx].topValue = newTop.val;
        }

        // Add to sorted elements
        sortedElements.push(minVal);
        sortedGroups[writeIdx] = palette[minPileIdx % palette.length];

        // Reconstruct array: [ ...sortedElements, ...flattened_piles ]
        const nextArr = [...sortedElements];
        const nextGroups = { ...sortedGroups };
        let idx = writeIdx + 1;
        piles.forEach((pile, pIdx) => {
            pile.cards.forEach(card => {
                nextArr.push(card.val);
                nextGroups[idx] = palette[pIdx % palette.length];
                idx++;
            });
        });

        currentArr = nextArr;
        setArray([...currentArr]);
        setGroupIndices({ ...nextGroups });
        
        countSwap();
        setSwapIndices([writeIdx]);
        setCompareIndices([]);
        
        playSound(minVal, 'triangle', writeIdx);
        if (!(await wait(0.5))) return false;

        writeIdx++;
    }

    setGroupIndices({});
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
