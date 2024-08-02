// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex item-center justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Stock Market Data Analysis</Link>
        </div>
        <div className="space-x-4">
        <Link href="/initial">About</Link>
        <Link href="/home">Dashboard</Link>
        
        <Link href="/">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
