import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';


export default async function UserSignUp() {
  // get user from cookie next 13
  const cookieStore = cookies()
  const user = cookieStore.get('user');

  if (user) return redirect('/algorithm');
  if (!user) return redirect('/user/register');
}
