import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { CiMenuBurger } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';

const Header = () => {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatar_url = profile?.avatar_url;

  // Active link style for desktop
  const desktopLinkClass = ({ isActive }) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-blue-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;

  // Active link style for mobile
  const mobileLinkClass = ({ isActive }) =>
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
      isActive
        ? 'border-blue-500 text-blue-700 bg-blue-50'
        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
    }`;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <img className="h-14 w-auto" src="/hire.png" alt="HireHub Logo" />

              <NavLink to="/" className="text-blue-600 text-2xl font-bold">
                Hire<span className="text-green-950">Hub</span>
              </NavLink>
            </div>

            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" className={desktopLinkClass}>
                Home
              </NavLink>
              <NavLink to="/jobs" className={desktopLinkClass}>
                Jobs
              </NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" className={desktopLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/post-job" className={desktopLinkClass}>
                    Post Job
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-gray-700">
                  <span>Hello, {profile?.username}</span>
                </div>

                <div className="relative">
                  <button
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {avatar_url ? (
                      <img
                        src={avatar_url}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500">
                        <FaUser className="text-gray-600" />
                      </span>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 w-48 bg-white mt-1 rounded-md shadow-lg z-10"
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <div className="absolute h-3 w-full top-[12px]"></div>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </NavLink>
                      <NavLink
                        to="/my-applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Applications
                      </NavLink>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Signout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <NavLink
                  to="/signin"
                  className="inline-flex items-center justify-center px-4 py-2 border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-white border border-blue-600 hover:bg-blue-50"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md text-gray-400"
            >
              {isMenuOpen ? (
                <IoMdClose className="block w-6 h-6" />
              ) : (
                <CiMenuBurger className="block w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden py-4">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/jobs"
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/post-job"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </>
            )}

            {!user && (
              <>
                <NavLink
                  to="/signin"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
