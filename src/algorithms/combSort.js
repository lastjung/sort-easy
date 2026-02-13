export const combSort = async ({
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
  const shrink = 1.3;
  let gap = n;
  let swapped = true;

  setSortedIndices([]);
  setGoodIndices([]);
  setDescription(msg.START);
  if (!(await wait(1))) return false;

  while (gap > 1 || swapped) {
    if (!sortingRef.current) break;
    gap = Math.max(1, Math.floor(gap / shrink));
    swapped = false;

    setDescription({ ...(msg.GAP || {}), text: `Gap: ${gap}` });
    if (!(await wait(0.8))) break;

    for (let i = 0; i + gap < n; i++) {
      if (!sortingRef.current) break;
      const j = i + gap;

      setCompareIndices([i, j]);
      setSwapIndices([]);
      countCompare();
      setDescription(msg.COMPARE);
      playSound(220 + arr[i] * 5, 'sine');
      if (!(await wait(1))) break;

      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwapIndices([i, j]);
        countSwap();
        swapped = true;
        setDescription(msg.SWAP);
        playSound(130 + arr[i] * 5, 'sawtooth');
        if (!(await wait(1))) break;
      }
    }
  }

  if (!sortingRef.current) return false;

  setCompareIndices([]);
  setSwapIndices([]);
  setSortedIndices([...Array(n).keys()]);
  setDescription(msg.FINISHED);
  return true;
};
