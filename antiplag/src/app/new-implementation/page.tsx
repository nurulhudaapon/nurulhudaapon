import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { executeQuery } from "../../query";
import { CodeBlock } from "../algorithm/code-block";
import { convertToSlug } from "../../algo";
import { Base64ImageInput } from "../../components/input";

export default async function Index() {

    return <main>
        <AddCodeForm />

    </main>
}

async function AddCodeForm() {
    const cookieStore = cookies();
    const user = JSON.parse(cookieStore.get("user")?.value || '{}');


    async function handleAddCode(formData: FormData) {
        "use server";


        const attachments = {
            images: [],
        };

        try {
            console.log('FORMDATA', formData.get("attachments"))
            attachments.images = JSON.parse(formData.get("attachments") as string);
        } catch (error) {
            console.error('Error parsing images', error);
        }

        console.log('USER', attachments)

        const rawFormData = {
            user_id: formData.get("user_id"),
            algorithm: formData.get("algorithm"),
            variation: formData.get("variation"),
            code: formData.get("code"),
            slug: convertToSlug(String(formData.get("algorithm")) || ''),
            attachments: JSON.stringify(attachments),
        };

        console.log('USERID', user.id)

        await executeQuery("create_code", rawFormData);

        //  invalidate cache of implementations page next 13

        redirect(`/algorithm/${rawFormData.slug}`);
    }

    return (
        <form action={handleAddCode} encType="multipart/form-data">
            <input type="hidden" name="user_id" value={user.id} required />
            <label>
                Algorithm
                <input type="text" name="algorithm" required />
            </label>
            <label>
                Variation
                <input type="text" name="variation" />
            </label>
            <label>
                Attachments
                <Base64ImageInput name="attachments" />
            </label>
            <label>
                Code
                {/* <textarea name="code" /> */}
                <CodeBlock name={'code'}>

                    {`
#include <stdio.h>

int main() {
    printf("Hello World!");
    return 0;
}
                `}

                </CodeBlock>
            </label>

            <input className="mt-3" type="submit" value="Save new implementation" />
        </form>
    );
}