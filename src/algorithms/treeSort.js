export const treeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
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

    class TreeNode {
        constructor(val, originalIndex, depth) {
            this.val = val;
            this.originalIndex = originalIndex;
            this.depth = depth;
            this.bfsIndex = -1;
            this.left = null;
            this.right = null;
        }
    }

    let root = null;
    let currentArr = [...originalArray];
    let groups = {};

    // Helper to get BFS list of current BST
    const getBFSList = (treeRoot) => {
        if (!treeRoot) return [];
        const list = [];
        const queue = [treeRoot];
        while (queue.length > 0) {
            const curr = queue.shift();
            list.push(curr);
            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }
        return list;
    };

    setDescription({ text: "Building Search Tree", type: "TARGET" });
    if (!(await wait(1))) return false;

    // Build BST
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;

        let val = originalArray[i];
        let currentElementIdx = i; // The unprocessed element is at index `i` in currentArr

        if (root === null) {
            root = new TreeNode(val, i, 0);
            
            const bfsList = getBFSList(root);
            bfsList[0].bfsIndex = 0;
            
            groups[0] = palette[0];
            setGroupIndices({ ...groups });
            setGoodIndices([0]);
            playSound(val, 'triangle', 0);
            if (!(await wait(1))) return false;
            setGoodIndices([]);
        } else {
            let curr = root;
            let depth = 0;
            while (true) {
                if (!sortingRef.current) return false;
                
                countCompare();
                // Compare with current node's BFS position
                setCompareIndices([currentElementIdx, curr.bfsIndex]);
                playSound(curr.val, 'sine', curr.bfsIndex);
                if (!(await wait(1))) return false;

                depth++;
                if (val < curr.val) {
                    if (curr.left === null) {
                        curr.left = new TreeNode(val, i, depth);
                        break;
                    } else {
                        curr = curr.left;
                    }
                } else {
                    if (curr.right === null) {
                        curr.right = new TreeNode(val, i, depth);
                        break;
                    } else {
                        curr = curr.right;
                    }
                }
            }
            
            // Reconstruct array: [ ...bfsList, ...unprocessed ]
            const bfsList = getBFSList(root);
            const nextArr = [];
            const nextGroups = {};
            
            bfsList.forEach((node, idx) => {
                node.bfsIndex = idx;
                nextArr.push(node.val);
                nextGroups[idx] = palette[node.depth % palette.length];
            });
            for (let k = i + 1; k < n; k++) {
                nextArr.push(originalArray[k]);
            }

            currentArr = nextArr;
            groups = nextGroups;
            setArray([...currentArr]);
            setGroupIndices({ ...groups });
            
            // Highlight the newly inserted element at its level position
            let newInsertedIdx = bfsList.length - 1;
            setGoodIndices([newInsertedIdx]);
            playSound(val, 'triangle', newInsertedIdx);
            if (!(await wait(1))) return false;
            setGoodIndices([]);
        }
    }
    setCompareIndices([]);

    setDescription({ text: "Traversing Tree (In-order)", type: "INFO" });
    if (!(await wait(1))) return false;

    const sortedList = [];
    const inOrderTraversal = async (node) => {
        if (node !== null) {
            if (!sortingRef.current) return;
            
            // Traverse left
            await inOrderTraversal(node.left);
            
            if (!sortingRef.current) return;
            
            // Visit current node visually
            sortedList.push(node);
            
            // Highlight the node at its current BFS position
            setCompareIndices([node.bfsIndex]);
            playSound(node.val, 'sine', node.bfsIndex);
            setDescription({ text: "Visiting node: " + node.val, type: "COMPARE" });
            if (!(await wait(1))) return;
            
            // Traverse right
            await inOrderTraversal(node.right);
        }
    };

    await inOrderTraversal(root);
    if (!sortingRef.current) return false;
    setCompareIndices([]);

    setDescription({ text: "Writing back sorted array", type: "SWAP" });
    if (!(await wait(1))) return false;

    // Write back
    const sortedGroups = {};
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;

        let node = sortedList[i];
        
        // Highlight source (where it was in level layout) and target (sorted position)
        setCompareIndices([node.bfsIndex]);
        setSwapIndices([i]);
        setDescription({ text: "Placing value: " + node.val, type: "SWAP" });
        playSound(node.val, 'sine', node.bfsIndex);
        if (!(await wait(1))) return false;

        currentArr[i] = node.val;
        setArray([...currentArr]);
        
        countSwap();
        setSwapIndices([i]);
        setCompareIndices([]);
        
        sortedGroups[i] = palette[node.depth % palette.length];
        setGroupIndices({ ...groups, ...sortedGroups });
        
        playSound(node.val, 'triangle', i);
        if (!(await wait(1))) return false;
    }

    setGroupIndices({});
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
