import React from 'react';
import "./index.css";

import CoursesIntakeForm from './components/coursesIntakeForm';
import Header from './components/header';
import Footer from './components/footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Section */}
      <main className="flex-grow bg-gradient-to-b from-lime-100 to-lime-200 py-8">
        <div className="w-full px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <CoursesIntakeForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

