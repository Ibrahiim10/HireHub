import { Link } from 'react-router';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* right and left  humbugger*/}
        <div className="flex justify-between h-16">
          {/* left */}
          <div className="flex">
            {/* logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-orange-600 text-2xl font-bold">
                Hire<span className="text-green-950">Hub</span>
              </Link>
            </div>

            {/* nav links */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-orange-500 text-sm font-medium text-gray-500"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500"
              >
                Jobs
              </Link>
            </nav>
          </div>

          {/* right */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span>Hello , Ibrahim</span>
            </div>

            {/* buttons */}
            <div className=" hidden sm:flex sm:items-center sm:space-x-4">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-4 py-2 border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-orange-600 bg-white border border-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
