import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlgorithmSelector, VariationSelector } from "../selector";
import { CodeBlock } from "../code-block";
import { executeQuery } from "../../../query";

export default async function Index(props) {
  const algorithmSlug = props.params.algorithm_id;

  console.log(props);
  const cookieStore = cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");

  const codes = await executeQuery<any[]>("get_code_list_by_slug", {
    slug: algorithmSlug,
  });

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

  return (
    <div>
      <form action={handleAddCode}>
        <div className="flex gap-3 flex-row">
          <AlgorithmSelector value={algorithmSlug} />
          <VariationSelector  value={algorithmSlug}/>
        </div>

        {codes.map((code) => (
          <div className="flex gap-10 flex-col">
            <CodeBlock name={code.id} key={code.id}>
              {code.code}
            </CodeBlock>
          </div>
        ))}

        <input type="hidden" name="user_id" value={user.id} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
