import React from 'react';
import { Link } from 'react-router';

const Signin = () => {
  // handle submit
  //   const handleSubmit = async (event) => {
  //     event.preventDefault();
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       await signInUser(email, password);
  //       navigate('/');
  //     } catch (error) {
  //       setError(
  //         error.message || 'Failed to sign in. Please check your credentials.'
  //       );
  //       console.log('error', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          {/* title and subtitle */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          {/* form info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )} */}
            <form>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2 "
                  htmlFor="email"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  //   value={email}
                  //   onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2 "
                  htmlFor="password"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="******"
                  //   value={password}
                  //   onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-200 disabled:cursor-not-allowed"
                //   disabled={isLoading}
              >
                {/* {isLoading ? 'Signing in...' : 'Sign In'} */}
                Sign In
              </button>
            </form>

            <div className="text-center mt-6 ">
              <p className="text-gray-600 text-sm">
                {/* Don't have an account?{' '} */}
                <Link
                  to="/signup"
                  className="text-orange-600 hover:text-orange-800 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
