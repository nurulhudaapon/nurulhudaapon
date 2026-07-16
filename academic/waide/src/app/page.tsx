import { cookies } from 'next/headers';
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default function Home() {
  const cookieStore = cookies()

  const user = cookieStore.get('user');
  console.log('user:', user);
  if (user) return redirect('/algorithm');
  if (!user) return redirect('/user/register');

  return redirect('/user')
}