import React, { useEffect, useState } from 'react';
import "./index.css";

import CoursesAdmissionForm from './components/coursesAdmissionForm';
import MemberRegistrationForm from './components/memberRegistrationForm';
import StudentRegistrationForm from "./components/studentRegistrationForm"
import ApplicantList from "./components/applicantsList"
import Header from './components/header';
import Footer from './components/footer';
import CompanyLogo from './images/vyg-uganda.jpeg';
import { useUserLoginMutation } from './backend/api/sharedCrud';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cards, setCards] = useState({
    studentAdmissionForm: {
      key: "studentAdmissionForm",
      visible: true,
      component: CoursesAdmissionForm
    },
    studentRegistrationForm: {
      key: "studentRegistrationForm",
      visible: false,
      component: StudentRegistrationForm
    },
    memberRegistrationForm: {
      key: "memberRegistrationForm",
      visible: false,
      component: MemberRegistrationForm
    },
    applicantListTable: {
      key: "applicantListTable",
      visible: false,
      component: ApplicantList
    },
  });

  console.log("----------")

  const showCard = (cardKey) => {
    if (cards[cardKey]) {
      setCards((prev) => ({
        ...prev,
        [cardKey]: {
          ...prev[cardKey],
          visible: true
        }
      }));
    }
  };

  const hideCard = (cardKey) => {
    if (cards[cardKey]) {
      setCards((prev) => ({
        ...prev,
        [cardKey]: {
          ...prev[cardKey],
          visible: false
        }
      }));
    }
  };

  let visibleCards = {};
  Object.values(cards).forEach(card => {
    visibleCards[card.key] = card.visible;
  });

  const [submitLoginForm, {
    data: loginSuccessResponse,
    isLoading: loginProcessing,
    isSuccess: loginSucceeded,
    isError: loginFailed,
    error: loginError,
  }] = useUserLoginMutation()

  useEffect(() => {
    if (loginSucceeded) {
      setIsLoggedIn(true);
    }
  }, [loginSucceeded])

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    submitLoginForm({ data: { email, password } })
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full relative text-center">
            <img src={CompanyLogo} alt="Company Logo" className="mx-auto mb-4 h-16" />
            <h2 className="text-xl font-semibold mb-4"> Login to Continue </h2>

            {/* ✅ ERROR MESSAGE */}
            {loginFailed && (
              <div className="text-red-600 text-sm mb-4">
                {loginError?.data?.message || 'Invalid credentials. Please try again.'}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                name="email" // ✅ should match your API field — was "username" before
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loginProcessing}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${loginProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loginProcessing ? 'Please wait...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Header showCard={showCard} hideCard={hideCard} visibleCards={visibleCards} />
      <main className="flex-grow bg-gradient-to-b from-lime-100 to-lime-200 py-8">
        <div className="w-full px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.values(cards).filter(card => card.visible).map(card => {
              const CardComponent = card.component;
              return (<CardComponent key={card.key} />);
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
