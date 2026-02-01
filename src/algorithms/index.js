
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { cocktailSort } from './cocktailSort';

export {
    bubbleSort,
    selectionSort,
    insertionSort,
    quickSort,
    mergeSort,
    heapSort,
    shellSort,
    cocktailSort
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
    }
];
