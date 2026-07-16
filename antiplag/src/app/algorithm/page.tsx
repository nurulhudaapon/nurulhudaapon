import { cookies } from "next/headers";
import { executeQuery } from "../../query";

import { CodeBlock } from "./code-block";
import { AlgorithmSelector, VariationSelector } from "./selector";
import { redirect } from "next/navigation";
import Link from "next/link";
import { generateAlgorithmDescription } from "../../algo";

export default async function Index() {
  const cookieStore = cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");

  async function handleAddCode(formData: FormData) {
    "use server";
    const rawFormData = {
      // user_id: formData.get("user_id"),
      algorithm: formData.get("algorithm"),
      variation: formData.get("variation"),
      code: formData.get("code"),
    };

    return redirect(`/algorithm/${rawFormData.algorithm}`);

    // await executeQuery("get_code_list", rawFormData);
  }

  const algos = await executeQuery<
    {
      id: number;
      code: string;
      variation: string;
      algorithm: string;
      slug: string;
    }[]
  >("get_algorithm_list");

  return (
    <div className="flex flex-wrap gap-3">
      {algos.map((algo) => (
        <Link
          key={algo.algorithm}
          href={`/algorithm/${algo.slug}`}
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {algo.algorithm}
          </h5>
          <h6 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
            {algo.variation}
          </h6>
          {/* <CodeBlock key={algo.id}>{algo.code}</CodeBlock> */}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {generateAlgorithmDescription(algo.variation) || 'No description available'}
          </p>
        </Link>
      ))}
    </div>
  );
}

