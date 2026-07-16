
import { redirect } from "next/navigation";
import { getQuery } from "../../../query";
import { getConnection } from "../../../query/db";
import { hashPassword } from "./algo";

const connection = getConnection();

export default async function UserSignUp() {
  async function handleSignup(formData: FormData) {
    "use server";

    const rawFormData = {
      email: formData.get("email"),
      password: hashPassword(String(formData.get("password"))),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
    };
    
    connection.query(
      getQuery("create_user"),
      Object.values(rawFormData),
      (err, results, fields) => {
        if (err) {
          console.log(err);
        }
        console.log('User created!, results:', results);

      }
    );

    return redirect('/user/login');

  }

  return (
    <div className="max-w-2xl h-[100vh] my-4 mx-auto align-center justify-center flex gap-10">
      <form
        action={handleSignup}
        className="flex flex-col justify-center gap-3"
      >
        <label>
          First Name
          <input type="text" name="first_name" />
        </label>
        <label>
          Last Name
          <input type="text" name="last_name" />
        </label>

        <label>
          Student ID
          <input type="text" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" autoComplete="new-password" />
        </label>
        <input type="submit" value="Sign Up" />
        already have an account? <a href="/user/login">Login</a>
      </form>
    </div>
  );
}
