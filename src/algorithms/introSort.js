export const introSort = async ({
  array,
  setArray,
  setCompareIndices,
  setSwapIndices,
  setGoodIndices,
  setSortedIndices,
  setDescription,
  playSound,
  wait,
  sortingRef,
  countCompare,
  countSwap,
  msg
}) => {
  const arr = [...array];
  const n = arr.length;
  const depthLimit = 2 * Math.floor(Math.log2(Math.max(2, n)));

  setSortedIndices([]);
  setGoodIndices([]);
  setDescription(msg.START);
  if (!(await wait(1))) return false;

  const insertionSortRange = async (lo, hi) => {
    for (let i = lo + 1; i <= hi; i++) {
      if (!sortingRef.current) return false;
      const key = arr[i];
      let j = i - 1;
      setGoodIndices([i]);
      while (j >= lo && arr[j] > key) {
        setCompareIndices([j, j + 1]);
        countCompare();
        setDescription(msg.COMPARE);
        playSound(260 + arr[j] * 5, 'sine');
        if (!(await wait(0.8))) return false;
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setSwapIndices([j, j + 1]);
        countSwap();
        if (!(await wait(0.8))) return false;
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSwapIndices([j + 1, i]);
      countSwap();
      if (!(await wait(0.6))) return false;
    }
    return true;
  };

  const heapSortRange = async (lo, hi) => {
    const len = hi - lo + 1;
    const heapify = async (size, root) => {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size) {
        setCompareIndices([lo + largest, lo + left]);
        countCompare();
        if (!(await wait(0.6))) return false;
        if (arr[lo + left] > arr[lo + largest]) largest = left;
      }
      if (right < size) {
        setCompareIndices([lo + largest, lo + right]);
        countCompare();
        if (!(await wait(0.6))) return false;
        if (arr[lo + right] > arr[lo + largest]) largest = right;
      }
      if (largest !== root) {
        [arr[lo + root], arr[lo + largest]] = [arr[lo + largest], arr[lo + root]];
        setArray([...arr]);
        setSwapIndices([lo + root, lo + largest]);
        countSwap();
        if (!(await wait(0.8))) return false;
        return heapify(size, largest);
      }
      return true;
    };

    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
      if (!sortingRef.current) return false;
      if (!(await heapify(len, i))) return false;
    }
    for (let end = len - 1; end > 0; end--) {
      if (!sortingRef.current) return false;
      [arr[lo], arr[lo + end]] = [arr[lo + end], arr[lo]];
      setArray([...arr]);
      setSwapIndices([lo, lo + end]);
      countSwap();
      if (!(await wait(0.8))) return false;
      if (!(await heapify(end, 0))) return false;
    }
    return true;
  };

  const partition = async (lo, hi) => {
    const pivot = arr[hi];
    setGoodIndices([hi]);
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (!sortingRef.current) return -1;
      setCompareIndices([j, hi]);
      countCompare();
      setDescription(msg.COMPARE);
      playSound(240 + arr[j] * 5, 'sine');
      if (!(await wait(0.7))) return -1;
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwapIndices([i, j]);
        countSwap();
        setDescription(msg.SWAP);
        if (!(await wait(0.7))) return -1;
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    setArray([...arr]);
    setSwapIndices([i + 1, hi]);
    countSwap();
    if (!(await wait(0.7))) return -1;
    return i + 1;
  };

  const sort = async (lo, hi, depth) => {
    if (!sortingRef.current) return false;
    if (lo >= hi) return true;

    const size = hi - lo + 1;
    if (size <= 12) {
      setDescription(msg.INSERT || msg.COMPARE);
      return insertionSortRange(lo, hi);
    }

    if (depth <= 0) {
      setDescription(msg.FALLBACK || msg.SWAP);
      return heapSortRange(lo, hi);
    }

    const p = await partition(lo, hi);
    if (p === -1) return false;
    if (!(await sort(lo, p - 1, depth - 1))) return false;
    return sort(p + 1, hi, depth - 1);
  };

  const done = await sort(0, n - 1, depthLimit);
  if (!done || !sortingRef.current) return false;

  setCompareIndices([]);
  setSwapIndices([]);
  setGoodIndices([]);
  setSortedIndices([...Array(n).keys()]);
  setDescription(msg.FINISHED);
  return true;
};
