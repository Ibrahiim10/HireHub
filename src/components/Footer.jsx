import { FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold">
            Hire <span className="text-green-950">Hub</span>{' '}
          </h3>
          <p className="text-sm mt-2 text-blue-100">
            Empowering careers. Connecting talent with opportunity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/jobs" className="hover:underline">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link to="/post-job" className="hover:underline">
                Post a Job
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/signin" className="hover:underline">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-4 text-white text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blue-700 text-center py-4 text-sm text-blue-100">
        &copy; {new Date().getFullYear()} HireHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
