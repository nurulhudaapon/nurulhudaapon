

  export function convertToSlug(sentence: string) {
    const validChars = "abcdefghijklmnopqrstuvwxyz0123456789-";
    let slug = "";
  
    for (let i = 0; i < sentence.length; i++) {
      const char = sentence[i].toLowerCase();
  
      if (validChars.includes(char)) {
        // Include valid characters in the slug
        slug += char;
      } else if (char === " ") {
        // Replace spaces with hyphens
        slug += "-";
      }
      // Ignore other special characters
    }
  
    return slug;
  }
  
  const DES_ALGO = {
    'bfs': 'Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a \'search key\'), and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
    'dfs': 'Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
    'dijkstra': 'Dijkstra\'s algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years later.',
    'kruskal': 'Kruskal\'s algorithm is an algorithm in graph theory that finds a minimum spanning tree for a connected weighted graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.',
    'prim': 'Prim\'s algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.',
    'bellman-ford': 'The Bellman–Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra\'s algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.',
    'floyd-warshall': 'The Floyd–Warshall algorithm is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). A single execution of the algorithm will find the lengths (summed weights) of the shortest paths between all pairs of vertices.',
    'a-star': 'A* is the most popular choice for pathfinding, because it’s fairly flexible and can be used in a wide range of contexts. A* is like Dijkstra’s algorithm in that it can be used to find a shortest path. A* is like Greedy Best-First-Search in that it can use a heuristic to guide itself.',
    'bogo-sort': 'Bogosort is a highly ineffective sorting function based on the generate and test paradigm. The function successively generates permutations of its input until it finds one that is sorted. It is not useful for sorting, but may be used for educational purposes, to contrast it with more efficient algorithms.',
    'bubble-sort': 'Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    'bucket-sort': 'Bucket sort, or bin sort, is a sorting algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm, or by recursively applying the bucket sorting algorithm.',
    'cocktail-sort': 'Cocktail shaker sort, also known as bidirectional bubble sort, cocktail sort, shaker sort (which can also refer to a variant of selection sort), ripple sort, shuffle sort, or shuttle sort, is a variation of bubble sort that is both a stable sorting algorithm and a comparison sort.',
    'comb-sort': 'Comb sort is a relatively simple sorting algorithm originally designed by Włodzimierz Dobosiewicz in 1980. Later it was rediscovered by Stephen Lacey and Richard Box in 1991. Comb sort improves on bubble sort.',
    'counting-sort': 'Counting sort is an algorithm for sorting a collection of objects according to keys that are small integers; that is, it is an integer sorting algorithm. It operates by counting the number of objects that have each distinct key value, and using arithmetic on those counts to determine the positions of each key value in the output sequence.',
    'cycle-sort': 'Cycle sort is an in-place, unstable sorting algorithm, a comparison sort that is theoretically optimal in terms of the total number of writes to the original array, unlike any other in-place sorting algorithm. It is based on the idea that the permutation to be sorted can be factored into cycles, which can individually be rotated to give a sorted result.',
    'gnome-sort': 'Gnome sort is a sorting algorithm originally proposed by an Iranian computer scientist Hamid Sarbazi-Azad (professor of computer science and engineering at Sharif University of Technology) in 2000.',
    'heap-sort': 'Heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like that algorithm, it divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.',
    'insertion-sort': 'Insertion sort is a sorting algorithm that places an unsorted element at its suitable place in each iteration.',
    'merge-sort': 'Merge sort is a sorting technique based on divide and conquer technique. With worst-case time complexity being Ο(n log n), it is one of the most respected algorithms.',
    'quick-sort': 'QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
    'radix-sort': 'Radix sort is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix.',
    'selection-sort': 'Selection sort is a sorting algorithm that selects the smallest element from an unsorted list in each iteration and places that element at the beginning of the unsorted list.',
    'shell-sort': 'Shell sort is a highly efficient sorting algorithm and is based on insertion sort algorithm. This algorithm avoids large shifts as in case of insertion sort, if the smaller value is to the far right and has to be moved to the far left.',
    'stooge-sort': 'Stooge sort is a recursive sorting algorithm with a time complexity of O(nlog3 / log1.5) = O(n2.7095...). The running time of the algorithm is thus slower compared to efficient sorting algorithms, such as Merge sort, and is even slower than Bubble sort, a canonical example of a fairly inefficient and simple sort.',
    'strand-sort': 'Strand sort is a sorting algorithm. It works by repeatedly pulling sorted sublists out of the list to be sorted and merging them with a result array.',
    'tree-sort': 'Tree sort is a sorting algorithm that is based on Binary Search Tree data structure. It first creates a binary search tree from the elements of the input list or array and then performs an in-order traversal on the created binary search tree to get the elements in sorted order.',
    'b-tree': 'A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. The B-tree generalizes the binary search tree, allowing for nodes with more than two children.',
  }


export function generateAlgorithmDescription(algorithm: string) {
  let bestMatch = '';
  let bestMatchScore = 0;

  for (const key in DES_ALGO) {
    const score = stringSimilarityScore(algorithm, key + ' ' + DES_ALGO[key as keyof typeof DES_ALGO])
    if (score > bestMatchScore) {
      bestMatch = key;
      bestMatchScore = score;
    }
  }

  return DES_ALGO[bestMatch as keyof typeof DES_ALGO];
}

function stringSimilarityScore(a: string, b: string) {
  const aWords = a?.split(' ').flatMap((word) => word.split('-'));
  const bWords = b?.split(' ').flatMap((word) => word.split('-'));
  let score = 0;

  for (const aWord of aWords || []) {
    for (const bWord of bWords) {
      if (bWord.toLowerCase() === aWord.toLowerCase()) {
        score++;
      }
    }
  }

  return score;
}

export function hashPassword(str: string) {
  let hash = 3344; // Initial hash value

  for (let i = 0; i < str.length; i++) {
      hash = (hash * 859) ^ str.charCodeAt(i);
  }

  return hash >>> 0;
}

type TermFreqMap = { [word: string]: number };
type Dict = { [term: string]: boolean };
type TermFreqVector = number[];

function calculateTermFrequency(str: string): TermFreqMap {
  const words = str.split('\n');
  const termFreq: TermFreqMap = {};

  words.forEach((word) => {
    termFreq[word] = (termFreq[word] || 0) + 1;
  });

  return termFreq;
}

function convertTermFreqMapToVector(map: TermFreqMap, dict: Dict): TermFreqVector {
  const termFreqVector: TermFreqVector = [];

  for (const term in dict) {
    termFreqVector.push(map[term] || 0);
  }

  return termFreqVector;
}

function calculateDotProduct(vecA: TermFreqVector, vecB: TermFreqVector): number {
  let product = 0;

  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }

  return product;
}

function calculateVectorMagnitude(vec: TermFreqVector): number {
  let sum = 0;

  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }

  return Math.sqrt(sum);
}

function calculateCosineSimilarity(vecA: TermFreqVector, vecB: TermFreqVector): number {
  return calculateDotProduct(vecA, vecB) / (calculateVectorMagnitude(vecA) * calculateVectorMagnitude(vecB));
}

export function calculateTextCosineSimilarity(strA: string, strB: string): number {
  const termFreqA = calculateTermFrequency(strA);
  const termFreqB = calculateTermFrequency(strB);

  const dict: Dict = {};
  for (const term in termFreqA) {
    dict[term] = true;
  }

  for (const term in termFreqB) {
    dict[term] = true;
  }

  const termFreqVecA = convertTermFreqMapToVector(termFreqA, dict);
  const termFreqVecB = convertTermFreqMapToVector(termFreqB, dict);

  return calculateCosineSimilarity(termFreqVecA, termFreqVecB);
}