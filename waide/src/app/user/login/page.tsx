import { cookies } from "next/headers";
import { executeQuery, getQuery } from "../../../query";
import { getConnection } from "../../../query/db";
import { hashPassword } from "./algo";
import { redirect } from "next/navigation";

export default async function UserSignUp() {
  async function handleSignin(formData: FormData) {
    "use server";
    const cookieStore = cookies();

    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const results = await executeQuery<any[]>("login_user", rawFormData);

    // console.log(results);
    const user = results?.at(0);
    if (!user) throw new Error("User not found!");

    const dbPassword = +user.password;
    const passedPassword = String(formData.get("password"));

    const dbHashedPassword = dbPassword;
    const hashedPassword = hashPassword(passedPassword);

    if (dbHashedPassword == hashedPassword) {
      console.log("Login successfull!");

      // set user in the cookie
      // redirect to dashboard
      console.log("USER", user);
      cookieStore.set("user", JSON.stringify(user));
    } else {
      console.log("Incorrect passwrd!", {
        dbHashedPassword,
        dbPassword,
        passedPassword,
        hashedPassword,
      });
    }

    return redirect("/algorithm");
  }

  return (
    <div className="max-w-2xl h-[100vh] my-4 mx-auto align-center justify-center flex gap-10">
      <form
        action={handleSignin}
        className="flex flex-col justify-center gap-3"
      >
        <label>
          Student ID
          <input type="text" name="email" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
