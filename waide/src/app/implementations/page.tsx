import Link from "next/link";
import { executeQuery } from "../../query";
import { CodeBlock, CodeBlockSimple } from "../algorithm/code-block";
import { calculateTextCosineSimilarity } from "../../algo";

export default async function UserSignUp() {
  const codes = await executeQuery<
    { code: string; variation: string; algorithm: string }[]
  >("get_code_list");

  // const code = code.code;

  // console.log(codes);

  function matchingPercentage(currentCode: string, currentIndex: number, variation: string) {
    let similiarity = 0;
    let similiarityCount = 0;
    codes.forEach((code, i) => {
      if (i !== currentIndex && code.variation === variation) {
        similiarityCount++;
        similiarity += calculateTextCosineSimilarity(currentCode, code.code);
      }
    });

    const result = similiarity / similiarityCount;
    if (isNaN(result)) {
      return 0;
    }
    return result;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {codes.map((code, i) => (
        <div
          key={code.algorithm}
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {code.algorithm}
          </h5>
          <h6 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
            {code.variation}
          </h6>
          {/* <CodeBlock key={algo.id}>{algo.code}</CodeBlock> */}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {/* {generateAlgorithmDescription(algo.variation) || 'No description available'} */}
          </p>
          <CodeBlockSimple key={i}>{code.code}</CodeBlockSimple>

          <h6 className="mb-2 tracking-tight text-gray-900 dark:text-white">
            {code.first_name} {code.last_name}: {code.email}
          </h6>
          <h6 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
            Similarity: {(matchingPercentage(code.code, i, code.variation) * 100).toFixed(2)}%
          </h6>
        </div>
      ))}
    </div>
  );
}
