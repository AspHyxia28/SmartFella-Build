import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <ul className="flex space-x-6 py-2">
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/crud">Characters</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/relic_set">Relic Set</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/head">Relic Head Piece</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/hand">Relic Hand Piece</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/body">Relic Body Piece</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/feet">Relic Feet Piece</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/sphere">Relic Planar Sphere</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/rope">Relic Link Rope</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/build">Character Build</Link>
          </li>
          <li className="hover:text-blue-200 transition duration-200">
            <Link href="/">Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
