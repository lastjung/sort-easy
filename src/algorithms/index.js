
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { cocktailSort } from './cocktailSort';
import { combSort } from './combSort';
import { introSort } from './introSort';
import { countingSort } from './countingSort';
import { bitonicSort } from './bitonicSort';
import { radixSort } from './radixSort';
import { gnomeSort } from './gnomeSort';
import { pancakeSort } from './pancakeSort';
import { gravitySort } from './gravitySort';
import { timSort } from './timSort';
import { cycleSort } from './cycleSort';
import { bucketSort } from './bucketSort';
import { circleSort } from './circleSort';
import { pigeonholeSort } from './pigeonholeSort';
import { msdRadixSort } from './msdRadixSort';
import { flashSort } from './flashSort';
import { tournamentSort } from './tournamentSort';
import { strandSort } from './strandSort';
import { librarySort } from './librarySort';

export {
    bubbleSort,
    selectionSort,
    insertionSort,
    quickSort,
    mergeSort,
    heapSort,
    shellSort,
    cocktailSort,
    combSort,
    introSort,
    countingSort,
    bitonicSort,
    radixSort,
    gnomeSort,
    pancakeSort,
    gravitySort,
    timSort,
    cycleSort,
    bucketSort,
    circleSort,
    pigeonholeSort,
    msdRadixSort,
    flashSort,
    tournamentSort,
    strandSort,
    librarySort
};

export const ALGORITHMS = [
    { 
        id: 'bubble', 
        title: 'Bubble Sort', 
        fn: bubbleSort, 
        complexity: 'O(n²)', 
        desc: 'Adjacent elements are compared and swapped if they are in the wrong order.',
        icon: '🫧',
        slogan: "Spot the largest values bubbling to the top!"
    },
    { 
        id: 'selection', 
        title: 'Selection Sort', 
        fn: selectionSort, 
        complexity: 'O(n²)', 
        desc: 'Repeatedly finds the minimum element and puts it at the beginning.',
        icon: '🎯',
        slogan: "Scanning for the smallest to capture!"
    },
    { 
        id: 'insertion', 
        title: 'Insertion Sort', 
        fn: insertionSort, 
        complexity: 'O(n²)', 
        desc: 'Builds the sorted array one item at a time by inserting elements.',
        icon: '📥',
        slogan: "Find the smallest by reverse bubbling!"
    },
    { 
        id: 'quick', 
        title: 'Quick Sort', 
        fn: quickSort, 
        complexity: 'O(n log n)', 
        desc: 'Divides array into partitions and sorts them recursively.',
        icon: '⚡',
        slogan: "Find the Pivot's spot to Divide & Conquer!"
    },
    { 
        id: 'merge', 
        title: 'Merge Sort', 
        fn: mergeSort, 
        complexity: 'O(n log n)', 
        desc: 'Recursively divides array in half and merges sorted parts.',
        icon: '🧩',
        slogan: "Merge small parts into a sorted big part!"
    },
    { 
        id: 'heap', 
        title: 'Heap Sort', 
        fn: heapSort, 
        complexity: 'O(n log n)', 
        desc: 'Builds a max-heap and repeatedly extracts the maximum.',
        icon: '🏔️',
        slogan: "Build a mountain and pick the peak!"
    },
    { 
        id: 'shell', 
        title: 'Shell Sort', 
        fn: shellSort, 
        complexity: 'O(n log n)', 
        desc: 'Sorts elements at specific intervals, reducing the gap.',
        icon: '🐚',
        slogan: "Sort with diminishing gaps for efficiency!"
    },
    { 
        id: 'cocktail', 
        title: 'Cocktail Sort', 
        fn: cocktailSort, 
        complexity: 'O(n²)', 
        desc: 'Bidirectional bubble sort, shaking elements both ways.',
        icon: '🍹',
        slogan: "Find the endpoints with bidirectional bubbling!"
    },
    { 
        id: 'comb', 
        title: 'Comb Sort', 
        fn: combSort, 
        complexity: 'O(n log n)', 
        desc: 'Improves bubble sort by comparing items with a shrinking gap.',
        icon: '🪮',
        slogan: "Sweep wide first, then fine-tune with tighter gaps!"
    },
    { 
        id: 'intro', 
        title: 'Intro Sort', 
        fn: introSort, 
        complexity: 'O(n log n)', 
        desc: 'Starts with quick sort and falls back to safer strategies.',
        icon: '🧠',
        slogan: "Quick by default, safe by design under pressure!"
    },
    { 
        id: 'counting', 
        title: 'Counting Sort', 
        fn: countingSort, 
        complexity: 'O(n + k)', 
        desc: 'Counts frequencies of values and writes back in order.',
        icon: '🧮',
        slogan: "Count first, then place each value in sorted order!"
    },
    { 
        id: 'bitonic', 
        title: 'Bitonic Sort', 
        fn: bitonicSort, 
        complexity: 'O(n log² n)', 
        desc: 'A parallelizable sorting network that recursively builds bitonic sequences and merges them. Ideal for hardware and GPU implementations.',
        icon: '🌐',
        slogan: "Mirror, compare, and merge in parallel!"
    },
    { 
        id: 'radix', 
        title: 'Radix Sort', 
        fn: radixSort, 
        complexity: 'O(nk)', 
        desc: 'A non-comparative sorting algorithm that sorts numbers digit by digit. It bypasses the O(n log n) limit for specific data types.',
        icon: '🔢',
        slogan: "Sorting digit by digit, from the ground up!"
    },
    { 
        id: 'msdradix', 
        title: 'MSD Radix Sort', 
        fn: msdRadixSort, 
        complexity: 'O(nk)', 
        desc: 'Most Significant Digit Radix Sort. Sorts numbers from left to right, recursively partitioning buckets.',
        icon: '🔡',
        slogan: "Sorting from top to bottom, one digit at a time!"
    },
    { 
        id: 'gnome', 
        title: 'Gnome Sort', 
        fn: gnomeSort, 
        complexity: 'O(n²)', 
        desc: 'A simple sorting algorithm inspired by how a garden gnome sorts flower pots. It moves elements backward and forward like a shuttle.',
        icon: '🍄',
        slogan: "Step forward or shuffle back, one pot at a time!"
    },
    { 
        id: 'pancake', 
        title: 'Pancake Sort', 
        fn: pancakeSort, 
        complexity: 'O(n²)', 
        desc: 'Focuses on reversing array segments. Like flipping a stack of pancakes to bring the largest one to the bottom of the pile.',
        icon: '🥞',
        slogan: "Flip the stack to get the perfect order!"
    },
    { 
        id: 'gravity', 
        title: 'Gravity Sort', 
        fn: gravitySort, 
        complexity: 'O(n × max)', 
        desc: 'Beads on an abacus fall under gravity. Each column settles to the bottom, naturally sorting values.',
        icon: '⬇️',
        slogan: "Let gravity do the sorting!"
    },
    { 
        id: 'tim', 
        title: 'Tim Sort', 
        fn: timSort, 
        complexity: 'O(n log n)', 
        desc: 'A hybrid algorithm combining Insertion Sort for small runs and Merge Sort for combining. Used in Python and Java.',
        icon: '⏱️',
        slogan: "The real-world champion of sorting!"
    },
    { 
        id: 'cycle', 
        title: 'Cycle Sort', 
        fn: cycleSort, 
        complexity: 'O(n²)', 
        desc: 'Minimizes writes by finding the correct position through counting. Each element is placed exactly once.',
        icon: '🔄',
        slogan: "Every element finds its home in one move!"
    },
    { 
        id: 'bucket', 
        title: 'Bucket Sort', 
        fn: bucketSort, 
        complexity: 'O(n + k)', 
        desc: 'Distributes elements into value-range buckets, sorts each bucket, then concatenates. Efficient for uniform distributions.',
        icon: '🪣',
        slogan: "Divide into buckets, conquer each one!"
    },
    { 
        id: 'pigeonhole', 
        title: 'Pigeonhole Sort', 
        fn: pigeonholeSort, 
        complexity: 'O(n + Range)', 
        desc: 'Similar to counting sort, but assigns items to specific holes based on their value.',
        icon: '🐦',
        slogan: "Every pigeon finds its own perfectly sized hole!"
    },
    { 
        id: 'flash', 
        title: 'Flash Sort', 
        fn: flashSort, 
        complexity: 'O(n)', 
        desc: 'A distribution sort that uses a mathematical formula to predict where each value belongs.',
        icon: '⚡',
        slogan: "Lightning fast placement with mathematical precision!"
    },
    { 
        id: 'circle', 
        title: 'Circle Sort', 
        fn: circleSort, 
        complexity: 'O(n log n log n)', 
        desc: 'A recursive sorting algorithm that compares elements at opposite ends of a range, creating a circle-like comparison pattern.',
        icon: '⭕',
        slogan: "Compare across the circle to spiral into order!"
    },
    { 
        id: 'tournament', 
        title: 'Tournament Sort', 
        fn: tournamentSort, 
        complexity: 'O(n log n)', 
        desc: 'Mimics a tournament bracket to find winners (minimums) and move them to sorted order.',
        icon: '🏔️',
        slogan: "Who will be the next champion of order?"
    },
    { 
        id: 'strand', 
        title: 'Strand Sort', 
        fn: strandSort, 
        complexity: 'O(n²)', 
        desc: 'Extracts sorted strands from the data and merges them into a single sorted list.',
        icon: '🎣',
        slogan: "Catch the sorted items like a pro angler!"
    },
    { 
        id: 'library', 
        title: 'Library Sort', 
        fn: librarySort, 
        complexity: 'O(n log n)', 
        desc: 'An insertion sort variation that keeps gaps between items for faster shelving.',
        icon: '📚',
        slogan: "Make some room for the new books on the shelf!"
    }
];
