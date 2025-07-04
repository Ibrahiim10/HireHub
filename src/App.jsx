import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const App = () => {
  return (
    <div>
      {/* header */}
      <main>
        {/* routes */}
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />

          {/* unauthenticated routes (redirect home if login) */}

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      {/* footer */}
    </div>
  );
};

export default App;
