export const sleepSort = async ({ array, setArray, setSwapIndices, setGoodIndices, setSortedIndices, setGroupIndices, setDisableGroupGaps, setDescription, playSound, wait, sortingRef, countSwap, msg }) => {
    const originalArray = [...array];
    const n = originalArray.length;
    const minVal = Math.min(...originalArray);

    setSortedIndices([]);
    setGoodIndices([]);
    setGroupIndices({});
    setDisableGroupGaps(true);
    setDescription(msg.START);
    if (!(await wait(1))) return false;

    // All elements start asleep
    const sleeping = originalArray.map((val, idx) => ({ val, originalIndex: idx, asleep: true }));
    const sorted = [];

    setDescription({ text: "All elements falling asleep... Zzz...", type: "TARGET" });
    const asleepColor = "#2b3a60"; // sleepy deep blue
    const wakeColor = "#ffb703";   // glowing warm gold

    const groups = {};
    for (let i = 0; i < n; i++) {
        groups[i] = asleepColor;
    }
    setGroupIndices({ ...groups });
    if (!(await wait(1))) return false;

    let clock = 0;
    while (sorted.length < n) {
        if (!sortingRef.current) return false;

        // Sync clock to minVal if it starts below
        if (clock < minVal) {
            clock = minVal;
        }

        const wakingIndices = [];
        for (let i = 0; i < sleeping.length; i++) {
            if (sleeping[i].asleep && sleeping[i].val === clock) {
                wakingIndices.push(i);
            }
        }

        if (wakingIndices.length > 0) {
            // Wake up matching elements
            wakingIndices.forEach(idx => {
                sleeping[idx].asleep = false;
                sorted.push(sleeping[idx].val);
                countSwap();
            });

            const stillSleeping = sleeping.filter(item => item.asleep).map(item => item.val);
            const nextArr = [...sorted, ...stillSleeping];

            setArray([...nextArr]);

            // Map colors: sorted (emerald), waking (gold), sleeping (indigo)
            const nextGroups = {};
            for (let s = 0; s < sorted.length - wakingIndices.length; s++) {
                nextGroups[s] = "#06d6a0";
            }
            for (let w = sorted.length - wakingIndices.length; w < sorted.length; w++) {
                nextGroups[w] = wakeColor;
            }
            for (let sl = sorted.length; sl < n; sl++) {
                nextGroups[sl] = asleepColor;
            }

            setGroupIndices({ ...nextGroups });
            
            const wakingRange = Array.from({ length: wakingIndices.length }, (_, i) => sorted.length - wakingIndices.length + i);
            setGoodIndices(wakingRange);
            
            setDescription({ text: `Clock: ${clock} | Woke up value ${clock}!`, type: "SWAP" });
            playSound(clock, 'triangle', sorted.length - 1);
            
            if (!(await wait(0.6))) return false;
            setGoodIndices([]);
        } else {
            setDescription({ text: `Clock: ${clock} | Sleeping... Zzz...`, type: "INFO" });
            if (!(await wait(0.04))) return false;
        }

        clock++;
    }

    setGroupIndices({});
    setSwapIndices([]);
    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
