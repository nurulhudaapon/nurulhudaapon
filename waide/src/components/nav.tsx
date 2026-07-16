import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const ITEMS = {
  algorithm: "Algorithm",
  implementations: "All Submissions",
  "new-implementation": "+ New Submission",
};

export function NavBar() {
  const cookieStore = cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");

  async function handleLogout() {
    "use server";
  const cookieStore = cookies();

    cookieStore.delete("user");
    return redirect("/user/login");
}


  return (
    <nav className="bg-gray-900 border-gray-200 pl-3">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
          Waide
        </span>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-1 mt-4 border pl-3 border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white bg-gray-800 md:bg-gray-900 border-gray-700">
            {Object.entries(ITEMS).map(([key, value]) => (
              <NavItem key={key} link={key}>
                {value}
              </NavItem>
            ))}
                <li className="flex justify-center justify-items-center mt-2 items-center">

              {user?.email && 
            <form action={handleLogout}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Log Out
            </button>
            </form>
}
                </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <li className="flex justify-center justify-items-center items-center">
      <Link
        href={"/" + link}
        className="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  hover:bg-gray-700 hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
