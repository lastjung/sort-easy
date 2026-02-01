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
    SCAN: { text: "Scanning for Minimum", type: MSG_TYPES.COMPARE },
    NEW_MIN: { text: "New Small Bar Found", type: MSG_TYPES.SWAP },
    TARGET: { text: "Targeting Next Position", type: MSG_TYPES.TARGET },
    SWAP: { text: "Swapping Target with Small Bar", type: MSG_TYPES.SWAP },
    FINISHED: { text: "Selection Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  insertion: {
    START: { text: "Starting Insertion Sort...", type: MSG_TYPES.INFO },
    PICK: { text: "Picking Active Bar", type: MSG_TYPES.TARGET },
    COMPARE: { text: "Comparing with Sorted Section", type: MSG_TYPES.COMPARE },
    SHIFT: { text: "Shifting Larger Bar", type: MSG_TYPES.SWAP },
    INSERT: { text: "Inserting Active Bar", type: MSG_TYPES.SUCCESS },
    FINISHED: { text: "Insertion Sort Completed!", type: MSG_TYPES.SUCCESS }
  },
  quick: {
    START: { text: "Starting Quick Sort...", type: MSG_TYPES.INFO },
    PIVOT: { text: "Pivot Bar Selected", type: MSG_TYPES.TARGET },
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
  }
};
