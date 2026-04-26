export const MSG_TYPES = {
  INFO: 'INFO',
  COMPARE: 'COMPARE',
  SWAP: 'SWAP',
  TARGET: 'TARGET',
  SUCCESS: 'SUCCESS'
};

export const ALGO_MESSAGES = {
  bubble: {
    START: { text: "Starting Bubble Sort...", type: MSG_TYPES.INFO },
    COMPARE: { text: "Comparing Adjacent Bars", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Larger Bar Forward", type: MSG_TYPES.SWAP },
    LOCKED: { text: "Largest Bar Locked", type: MSG_TYPES.TARGET },
    FINISHED: { text: "Bubble Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  selection: {
    START: { text: "Starting Selection Sort...", type: MSG_TYPES.INFO },
    SCAN: { text: "Scanning for Minimum...", type: MSG_TYPES.SUCCESS },
    NEW_MIN: { text: "New Minimum Found!", type: MSG_TYPES.SUCCESS },
    TARGET: { text: "Targeting Next Position", type: MSG_TYPES.TARGET },
    SWAP: { text: "Swapping to Front", type: MSG_TYPES.SUCCESS },
    FINISHED: { text: "Selection Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  insertion: {
    START: { text: "Starting Insertion Sort...", type: MSG_TYPES.INFO },
    PICK: { text: "Picking Active Bar", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Reverse Bubbling...", type: MSG_TYPES.SUCCESS },
    SHIFT: { text: "Reverse Bubbling...", type: MSG_TYPES.SUCCESS },
    INSERT: { text: "Inserting Active Bar", type: MSG_TYPES.SUCCESS },
    FINISHED: { text: "Insertion Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  quick: {
    START: { text: "Starting Quick Sort...", type: MSG_TYPES.INFO },
    PIVOT: { text: "Pivot Bar Selected", type: MSG_TYPES.TARGET },
    DIVIDE: { text: "Dividing Left & Right", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing with Pivot", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Smaller Bar", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Quick Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  merge: {
    START: { text: "Starting Merge Sort...", type: MSG_TYPES.INFO },
    DIVIDE: { text: "Dividing Array Range", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing Sub-arrays", type: MSG_TYPES.COMPARE },
    MERGE: { text: "Merging Sorted Bar", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Merge Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  heap: {
    START: { text: "Starting Heap Sort...", type: MSG_TYPES.INFO },
    HEAPIFY: { text: "Building Max Heap", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing with Children", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Max Bar to End", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Heap Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  shell: {
    START: { text: "Starting Shell Sort...", type: MSG_TYPES.INFO },
    GAP: { text: "Setting Gap Bars", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing Gap Bars", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Gap Bar", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Shell Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  cocktail: {
    START: { text: "Starting Cocktail Sort...", type: MSG_TYPES.INFO },
    FORWARD: { text: "Bubbling Larger Bar Forward", type: MSG_TYPES.TARGET },
    BACKWARD: { text: "Bubbling Smaller Bar Backward", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing Adjacent Bars", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Bar", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Cocktail Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  oddeven: {
    START: { text: "Starting Odd-Even Sort...", type: MSG_TYPES.INFO },
    ODD: { text: "Checking Odd Pairs", type: MSG_TYPES.TARGET },
    EVEN: { text: "Checking Even Pairs", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing Adjacent Pair", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Out-of-Order Pair", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Odd-Even Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  comb: {
    START: { text: "Starting Comb Sort...", type: MSG_TYPES.INFO },
    GAP: { text: "Shrinking Gap", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing Gap Pair", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Gap Pair", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Comb Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  intro: {
    START: { text: "Starting Intro Sort...", type: MSG_TYPES.INFO },
    COMPARE: { text: "Comparing Against Pivot", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Elements", type: MSG_TYPES.SWAP },
    INSERT: { text: "Using Insertion Sort on Small Range", type: MSG_TYPES.TARGET },
    FALLBACK: { text: "Depth Limit Reached: Heap Fallback", type: MSG_TYPES.TARGET },
    FINISHED: { text: "Intro Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  counting: {
    START: { text: "Starting Counting Sort...", type: MSG_TYPES.INFO },
    RANGE: { text: "Scanning Min/Max Range", type: MSG_TYPES.COMPARE },
    COUNT: { text: "Counting Value Frequencies", type: MSG_TYPES.TARGET },
    WRITE: { text: "Writing Values in Order", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Counting Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  bitonic: {
    START: { text: "Starting Bitonic Sort...", type: MSG_TYPES.INFO },
    COMPARE: { text: "Comparing Network Pair", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Positioning Elements", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Bitonic Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  oddevenmerge: {
    START: { text: "Starting Odd-Even Merge Sort...", type: MSG_TYPES.INFO },
    COMPARE: { text: "Comparing Network Wire", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Swapping Network Wire", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Odd-Even Merge Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  radix: {
    START: { text: "Starting Radix Sort...", type: MSG_TYPES.INFO },
    COUNT: { text: "Counting Digit Frequencies", type: MSG_TYPES.TARGET },
    WRITE: { text: "Writing Values by Digit", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Radix Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  gnome: {
    START: { text: "Starting Gnome Sort...", type: MSG_TYPES.INFO },
    COMPARE: { text: "Gnome Checking Pots", type: MSG_TYPES.COMPARE },
    SWAP: { text: "Shuttling Backward...", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Gnome Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  pancake: {
    START: { text: "Starting Pancake Sort...", type: MSG_TYPES.INFO },
    MAX: { text: "Finding Largest Pancake", type: MSG_TYPES.TARGET },
    FLIP: { text: "Flipping the Stack!", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Pancake Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  gravity: {
    START: { text: "Starting Gravity Sort...", type: MSG_TYPES.INFO },
    SETUP: { text: "Placing Beads on Grid", type: MSG_TYPES.TARGET },
    DROP: { text: "Beads Falling Down...", type: MSG_TYPES.SWAP },
    WRITE: { text: "Reading Sorted Values", type: MSG_TYPES.TARGET },
    FINISHED: { text: "Gravity Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  tim: {
    START: { text: "Starting Tim Sort...", type: MSG_TYPES.INFO },
    FINISHED: { text: "Tim Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  cycle: {
    START: { text: "Starting Cycle Sort...", type: MSG_TYPES.INFO },
    SCAN: { text: "Finding Correct Position", type: MSG_TYPES.COMPARE },
    PLACE: { text: "Placing Element in Cycle", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Cycle Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  bucket: {
    START: { text: "Starting Bucket Sort...", type: MSG_TYPES.INFO },
    DISTRIBUTE: { text: "Distributing into Buckets", type: MSG_TYPES.TARGET },
    SORT: { text: "Sorting Each Bucket", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Bucket Sort Completed!", type: MSG_TYPES.SUCCESS }
  }
};
