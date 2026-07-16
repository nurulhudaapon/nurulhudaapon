import { executeQuery } from "../../query";

export async function AlgorithmSelector({value}) {
    const algos = await executeQuery<
      {id: number, code: string; variation: string; algorithm: string; slug: string }[]
    >("get_algorithm_list");
  
    return (
      <select
        name="algorithm"
        id="algos"
        required
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option id="0" selected>Choose an algorithm</option>
        {algos.map((algo) => (
          <option value={algo.slug}>{algo.algorithm}</option>
        ))}
      </select>
    );
  }
  
  export async function VariationSelector({value}) {
    const variations = await executeQuery<
      {id: number, code: string; variation: string; algorithm: string }[]
    >("get_algorithm_variation_list", {
      slug: value,
    });
  
    return (
      <select
        name="variation"
        id="algos"
        required
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {variations.map((variation) => (
          <option value={variation.id}>{variation.variation}</option>
        ))}
      </select>
    );
  }
  