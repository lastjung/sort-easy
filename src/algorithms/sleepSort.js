export const sleepSort = async ({ array, setArray, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    const { COLORS } = await import('../constants/colors');
    const palette = COLORS.GROUP_PALETTE;

    setSortedIndices([]);
    setGoodIndices([]);
    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const rangeSize = maxVal - minVal + 1;

    // Rainbow spectrum mapping like Counting Sort
    const getColor = (val) => {
        if (rangeSize <= 1) return palette[0];
        const idx = Math.floor(((val - minVal) / rangeSize) * palette.length);
        return palette[idx % palette.length];
    };

    // Faded transparent ghost version of its rainbow color for Sleeping mode
    const getSleepColor = (val) => {
        const hex = getColor(val);
        if (hex.startsWith('#') && hex.length === 7) {
            return hex + "35"; // ~20% opacity for dreamy sleeping look
        }
        return hex;
    };

    const asleepColor = "#2b3a60"; // Dormant flat asleep color
    const wakeColor = "#ffb703";   // Glowing gold

    // Initially, all elements are in a uniform flat dormant color
    const initialGroups = {};
    for (let i = 0; i < n; i++) {
        initialGroups[i] = asleepColor;
    }
    setGroupIndices({ ...initialGroups });
    setArray([...arr]);
    if (!(await wait(1))) return false;

    const wokenUp = new Set();
    let clock = 0;

    // Phase 1: Scan & Spawn (Reveal rainbow colors from flat dormant colors as we scan!)
    setDescription({ text: "Scanning & activating timers... Revealing spectrum!", type: "TARGET" });

    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;

        // Highlight scan line
        setGoodIndices([i]);
        playSound(arr[i], 'sine', i);

        // Clock ticks sequentially as we scan
        clock += 2;

        // Check if any activated elements (index <= i) should wake up early
        const wakingInThisStep = [];
        for (let j = 0; j <= i; j++) {
            if (!wokenUp.has(j) && arr[j] <= clock) {
                wokenUp.add(j);
                wakingInThisStep.push(j);
                countSwap();
            }
        }

        // Calculate dynamic colors for this scan step
        const nextGroups = {};
        for (let x = 0; x < n; x++) {
            if (x > i) {
                nextGroups[x] = asleepColor;       // Ahead of scan line: still flat dormant color
            } else if (x === i) {
                nextGroups[x] = getColor(arr[x]); // Scan cursor: REVEALS vivid rainbow color!
            } else {
                // Behind scan line: either already awake (solid) or sleeping (faded rainbow)
                if (wakingInThisStep.includes(x)) {
                    nextGroups[x] = wakeColor;    // Flash gold if waking up at this exact step
                } else if (wokenUp.has(x)) {
                    nextGroups[x] = getColor(arr[x]); // Awake: solid rainbow
                } else {
                    nextGroups[x] = getSleepColor(arr[x]); // Sleeping: faded phantom rainbow
                }
            }
        }
        setGroupIndices(nextGroups);

        if (wakingInThisStep.length > 0) {
            // Flash waking elements in gold and play sound
            wakingInThisStep.forEach(idx => {
                playSound(arr[idx], 'triangle', idx);
            });

            if (!(await wait(0.5))) return false;

            // Turn waking elements solid, and current index falls asleep
            const postWakingGroups = {};
            for (let x = 0; x < n; x++) {
                if (x > i) {
                    postWakingGroups[x] = asleepColor;
                } else if (x === i) {
                    postWakingGroups[x] = getSleepColor(arr[x]); // Falls asleep after scan
                } else {
                    if (wokenUp.has(x)) {
                        postWakingGroups[x] = getColor(arr[x]);
                    } else {
                        postWakingGroups[x] = getSleepColor(arr[x]);
                    }
                }
            }
            setGroupIndices(postWakingGroups);
        } else {
            // Small delay for the scan progress, then it falls asleep
            if (!(await wait(0.15))) return false;
            const sleepGroups = { ...nextGroups };
            sleepGroups[i] = getSleepColor(arr[i]);
            setGroupIndices(sleepGroups);
        }
    }
    setGoodIndices([]);

    // Phase 2: Wake up any remaining elements that are still asleep after the scan
    setDescription({ text: "Waking remaining elements...", type: "INFO" });
    while (wokenUp.size < n) {
        if (!sortingRef.current) return false;

        // Jump clock to next smallest sleeping value
        let nextSleepVal = Infinity;
        for (let i = 0; i < n; i++) {
            if (!wokenUp.has(i) && arr[i] < nextSleepVal) {
                nextSleepVal = arr[i];
            }
        }

        if (nextSleepVal === Infinity) break;
        clock = nextSleepVal;

        const wakingIndices = [];
        for (let i = 0; i < n; i++) {
            if (!wokenUp.has(i) && arr[i] === clock) {
                wakingIndices.push(i);
                wokenUp.add(i);
                countSwap();
            }
        }

        if (wakingIndices.length > 0) {
            const nextGroups = {};
            for (let x = 0; x < n; x++) {
                if (wakingIndices.includes(x)) {
                    nextGroups[x] = wakeColor;
                } else if (wokenUp.has(x)) {
                    nextGroups[x] = getColor(arr[x]);
                } else {
                    nextGroups[x] = getSleepColor(arr[x]);
                }
            }
            setGroupIndices(nextGroups);

            wakingIndices.forEach(idx => {
                playSound(arr[idx], 'triangle', idx);
            });

            if (!(await wait(0.6))) return false;

            const postGroups = {};
            for (let x = 0; x < n; x++) {
                if (wokenUp.has(x)) {
                    postGroups[x] = getColor(arr[x]);
                } else {
                    postGroups[x] = getSleepColor(arr[x]);
                }
            }
            setGroupIndices(postGroups);
        }
    }

    if (!sortingRef.current) return false;

    setDescription({ text: "Waking complete! Rebuilding sorted array", type: "INFO" });
    if (!(await wait(1))) return false;

    // Phase 3: Slide elements into sorted order from left to right
    const sortedArr = [...arr].sort((a, b) => a - b);

    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) return false;

        arr[i] = sortedArr[i];
        setArray([...arr]);
        setSwapIndices([i]);
        playSound(arr[i], 'sine', i);

        // Update colors for sorted elements
        const finalGroups = {};
        for (let x = 0; x < n; x++) {
            finalGroups[x] = getColor(arr[x]);
        }
        setGroupIndices(finalGroups);

        if (!(await wait(0.2))) return false;
    }

    setGroupIndices({});
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
