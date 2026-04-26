export const introSort = async ({
  array,
  setArray,
  setCompareIndices,
  setSwapIndices,
  setGoodIndices,
  setSortedIndices,
  setGroupIndices,
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
  const { COLORS } = await import('../constants/colors');
  const depthLimit = 2 * Math.floor(Math.log2(Math.max(2, n)));
  const INSERTION_THRESHOLD = 16;

  setSortedIndices([]);
  setGoodIndices([]);
  setGroupIndices({});
  let sortedIndices = [];
  setDescription(msg.START);
  if (!(await wait(1))) return false;

  const updateGroups = () => {
    const groups = {};
    const sortedSet = new Set(sortedIndices);
    for (let k = 0; k < n; k++) {
        groups[k] = sortedSet.has(k) ? COLORS.GROUP_PALETTE[12] : COLORS.GROUP_PALETTE[1];
    }
    setGroupIndices(groups);
  };

  const insertionSortRange = async (lo, hi) => {
    for (let i = lo + 1; i <= hi; i++) {
      if (!sortingRef.current) return false;

      setGoodIndices([i]);

      const splitGroups = {};
      for (let k = 0; k < n; k++) {
        splitGroups[k] = (k >= lo && k < i) ? COLORS.GROUP_PALETTE[0] : COLORS.GROUP_PALETTE[1];
      }
      setGroupIndices(splitGroups);
      setDescription(msg.PICK);
      if (!(await wait(0.4))) return false;
      if (!sortingRef.current) return false;
      if (!(await wait(0.5))) return false;

      const joinedGroups = {};
      for (let k = 0; k < n; k++) {
        joinedGroups[k] = (k >= lo && k <= i) ? COLORS.GROUP_PALETTE[0] : COLORS.GROUP_PALETTE[1];
      }
      setGroupIndices(joinedGroups);
      if (!(await wait(0.4))) return false;
      if (!sortingRef.current) return false;

      let pivotPos = i;
      let j = i - 1;

      while (j >= lo) {
        if (!sortingRef.current) return false;

        setGoodIndices([pivotPos]);
        setCompareIndices([]);
        countCompare();
        setDescription(msg.COMPARE);
        playSound(arr[j], 'sine', j);
        if (!(await wait(1))) return false;

        if (arr[j] > arr[j + 1]) {
          setGoodIndices([pivotPos]);
          setSortedIndices([j]);
          setDescription(msg.SHIFT);
          playSound(arr[j], 'triangle', j);
          countSwap();
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          if (!(await wait(1))) return false;

          pivotPos = j;
          setSortedIndices([]);
          j--;
        } else {
          setDescription(msg.INSERT);
          break;
        }
      }

      setCompareIndices([]);
      setSwapIndices([]);
      setGroupIndices({});

      const settledRange = [...sortedIndices];
      for (let k = lo; k <= i; k++) {
        if (!settledRange.includes(k)) settledRange.push(k);
      }
      sortedIndices = settledRange;
      setSortedIndices([...sortedIndices]);
      setGoodIndices([]);
      playSound(arr[i], 'sine', i);
    }

    updateGroups();
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
        playSound(arr[lo + left], 'sine', lo + left);
        if (!(await wait(0.6))) return false;
        if (arr[lo + left] > arr[lo + largest]) largest = left;
      }
      if (right < size) {
        setCompareIndices([lo + largest, lo + right]);
        countCompare();
        playSound(arr[lo + right], 'sine', lo + right);
        if (!(await wait(0.6))) return false;
        if (arr[lo + right] > arr[lo + largest]) largest = right;
      }
      if (largest !== root) {
        [arr[lo + root], arr[lo + largest]] = [arr[lo + largest], arr[lo + root]];
        setArray([...arr]);
        setSwapIndices([lo + root, lo + largest]);
        countSwap();
        playSound(arr[lo + largest], 'triangle', lo + largest);
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
      playSound(arr[lo + end], 'triangle', lo + end);
      if (!(await wait(0.8))) return false;
      if (!(await heapify(end, 0))) return false;
    }
    for (let k = lo; k <= hi; k++) {
      if (!sortedIndices.includes(k)) sortedIndices.push(k);
    }
    setSortedIndices([...sortedIndices]);
    playSound(arr[hi], 'sine', hi);
    updateGroups();
    if (!(await wait(0.3))) return false;
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
      playSound(arr[j], 'sine', j);
      if (!(await wait(0.7))) return -1;
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwapIndices([i, j]);
        countSwap();
        setDescription(msg.SWAP);
        playSound(arr[i], 'triangle', i);
        if (!(await wait(0.7))) return -1;
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    setArray([...arr]);
    setSwapIndices([i + 1, hi]);
    countSwap();
    playSound(arr[i + 1], 'triangle', i + 1);
    if (!(await wait(0.7))) return -1;
    return i + 1;
  };

  const sort = async (lo, hi, depth) => {
    if (!sortingRef.current) return false;
    if (lo >= hi) {
      if (lo === hi && !sortedIndices.includes(lo)) {
        sortedIndices.push(lo);
        setSortedIndices([...sortedIndices]);
        updateGroups();
      }
      return true;
    }

    const size = hi - lo + 1;
    if (size <= INSERTION_THRESHOLD) {
      setDescription(msg.INSERT || msg.COMPARE);
      return insertionSortRange(lo, hi);
    }

    if (depth <= 0) {
      setDescription(msg.FALLBACK || msg.SWAP);
      return heapSortRange(lo, hi);
    }

    const p = await partition(lo, hi);
    if (p === -1) return false;
    if (!sortedIndices.includes(p)) {
      sortedIndices.push(p);
      setSortedIndices([...sortedIndices]);
      updateGroups();
      playSound(arr[p], 'sine', p);
    }
    if (!(await sort(lo, p - 1, depth - 1))) return false;
    return sort(p + 1, hi, depth - 1);
  };

  updateGroups();
  const done = await sort(0, n - 1, depthLimit);
  if (!done || !sortingRef.current) return false;

  setGroupIndices({});
  setCompareIndices([]);
  setSwapIndices([]);
  setGoodIndices([]);
  setSortedIndices([...Array(n).keys()]);
  setDescription(msg.FINISHED);
  return true;
};
