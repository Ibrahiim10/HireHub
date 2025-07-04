import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  return (
    <div>
      {/* header */}
      <Header />
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
      <Footer />
    </div>
  );
};

export default App;
