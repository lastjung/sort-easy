
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
    pancakeSort
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
        complexity: 'O(log² n)', 
        desc: 'A parallelizable sorting network that recursively builds bitonic sequences and merges them. Ideal for hardware and GPU implementations.',
        icon: '🌐',
        slogan: "A network of mirrors for parallel perfection!"
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
        id: 'gnome', 
        title: 'Gnome Sort', 
        fn: gnomeSort, 
        complexity: 'O(n²)', 
        desc: 'A simple sorting algorithm inspired by how a garden gnome sorts flower pots. It moves elements backward and forward like a shuttle.',
        icon: '🍄',
        slogan: "Forward and back like a tireless garden gnome!"
    },
    { 
        id: 'pancake', 
        title: 'Pancake Sort', 
        fn: pancakeSort, 
        complexity: 'O(n²)', 
        desc: 'Focuses on reversing array segments. Like flipping a stack of pancakes to bring the largest one to the bottom of the pile.',
        icon: '🥞',
        slogan: "Flip the stack to get the perfect order!"
    }
];
