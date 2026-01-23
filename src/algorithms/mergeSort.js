
export const mergeSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef }) => {
    const arr = [...array];
    const n = arr.length;

    const merge = async (l, m, r) => {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = arr.slice(l, m + 1);
        let R = arr.slice(m + 1, r + 1);

        setDescription(`Merging range from position ${l + 1} to ${r + 1}.`);
        setGoodIndices([...Array(r - l + 1).keys()].map(x => x + l)); 
        if (!(await wait(1))) return;

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (!sortingRef.current) return;
            setCompareIndices([l + i, m + 1 + j]);
            setDescription(`Comparing left (${l + i + 1}) and right (${m + j + 2}) sides.`);
            if (!(await wait(1))) break;

            if (L[i] <= R[j]) {
                arr[k] = L[i]; i++;
            } else {
                arr[k] = R[j]; j++;
            }
            setArray([...arr]);
            setSwapIndices([k]);
            playSound(400, 'square');
            if (!(await wait(1))) break;
            k++;
        }

        while (i < n1) {
            if (!sortingRef.current) return;
            arr[k] = L[i];
            setArray([...arr]);
            setSwapIndices([k]); i++; k++;
            if (!(await wait(0.5))) break;
        }
        while (j < n2) {
            if (!sortingRef.current) return;
            arr[k] = R[j];
            setArray([...arr]);
            setSwapIndices([k]); j++; k++;
            if (!(await wait(0.5))) break;
        }
        setSwapIndices([]); setGoodIndices([]);
    };

    const mSort = async (l, r) => {
        if (l < r) {
            let m = Math.floor((l + r) / 2);
            await mSort(l, m);
            await mSort(m + 1, r);
            await merge(l, m, r);
        }
    };

    await mSort(0, n - 1);
    setSortedIndices([...Array(n).keys()]);
    setDescription("Merge Sort Completed!");
    return true;
};
