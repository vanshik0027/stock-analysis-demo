import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  router.replace('/', null, { replace: true });

};

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex item-center justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/home">Stock Market Data Analysis</Link>
        </div>
        <div className="space-x-4">
          <Link href="/about">About</Link>
          <Link href="/home">Dashboard</Link>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
