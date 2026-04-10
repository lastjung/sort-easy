export const countingSort = async ({
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

  setSortedIndices([]);
  setGoodIndices([]);
  setGroupIndices({});
  setDescription(msg.START);
  if (!(await wait(1))) return false;

  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (!sortingRef.current) return false;
    setCompareIndices([i - 1, i]);
    countCompare();
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
    setDescription(msg.RANGE || msg.COMPARE);
    playSound(arr[i], 'sine', i);
    if (!(await wait(0.7))) return false;
  }

  const range = max - min + 1;
  const counts = new Array(range).fill(0);

  setDescription(msg.COUNT || msg.INFO);
  if (!(await wait(0.8))) return false;
  for (let i = 0; i < n; i++) {
    if (!sortingRef.current) return false;
    setGoodIndices([i]);
    counts[arr[i] - min]++;
    playSound(arr[i], 'triangle', i);
    if (!(await wait(0.5))) return false;
  }

  let writeIdx = 0;
  setGoodIndices([]);
  setDescription(msg.WRITE || msg.SWAP);
  if (!(await wait(0.8))) return false;
  for (let value = 0; value < range; value++) {
    while (counts[value] > 0) {
      if (!sortingRef.current) return false;
      const actual = value + min;
      arr[writeIdx] = actual;
      setArray([...arr]);
      setSwapIndices([writeIdx]);
      countSwap();
      playSound(actual, 'triangle', writeIdx);
      
      const groups = {};
      for (let k = 0; k < n; k++) {
          groups[k] = k <= writeIdx ? COLORS.GROUP_PALETTE[12] : COLORS.GROUP_PALETTE[1];
      }
      setGroupIndices(groups);
      
      setSortedIndices([...Array(writeIdx + 1).keys()]);
      if (!(await wait(0.6))) return false;
      writeIdx++;
      counts[value]--;
    }
  }

  setGroupIndices({});
  setCompareIndices([]);
  setSwapIndices([]);
  setGoodIndices([]);
  setSortedIndices([...Array(n).keys()]);
  setDescription(msg.FINISHED);
  return true;
};
