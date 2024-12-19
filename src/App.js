import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Footer from './components/footer';
import ServicesSection from './components/services';
import WorkSection from './components/work';
import ContactForm from './components/contactus';
import "./index.css"

function App() {

  return (
    <div className="font-sans bg-gray-100 m-0 p-0">
      <Navbar />
      <Hero />
      <About />
      {/* <WorkSection /> */}
      <ServicesSection />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
