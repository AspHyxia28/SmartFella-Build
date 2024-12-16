// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Logout</Link>
          </li>
          <li>
            <Link href="/crud">Characters</Link>
          </li>
          <li>
            <Link href="/relic_set">Relic Set</Link>
          </li>
          <li>
            <Link href="/head">Relic Headpiece</Link>
          </li>
          <li>
            <Link href="/hand">Relic Handpiece</Link>
          </li>
          <li>
            <Link href="/body">Relic Bodypiece</Link>
          </li>
          <li>
            <Link href="/feet">Relic Feetpiece</Link>
          </li>
          <li>
            <Link href="/sphere">Relic Planarsphere</Link>
          </li>
          <li>
            <Link href="/rope">Relic Linkrope</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;