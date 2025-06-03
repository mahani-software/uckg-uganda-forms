import React, { useState } from 'react';
import "./index.css";

import CoursesIntakeForm from './components/coursesIntakeForm';
import MemberRegistrationForm from './components/memberRegistrationForm';
import CoursesAdmissionForm from "./components/coursesAdmissionForm"
import Header from './components/header';
import Footer from './components/footer';

const App = () => {

  const [cards, setCards] = useState({
    studentAdmissionForm: {
      key: "studentAdmissionForm",
      visible: true,
      component: CoursesAdmissionForm
    },
    studentRegistrationForm: {
      key: "studentRegistrationForm",
      visible: false,
      component: CoursesIntakeForm
    },
    memberRegistrationForm: {
      key: "memberRegistrationForm",
      visible: false,
      component: MemberRegistrationForm
    },
  })

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

  let visibleCards = {}
  Object.values(cards).forEach(card => {
    visibleCards[card.key] = card.visible
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header showCard={showCard} hideCard={hideCard} visibleCards={visibleCards} />
      <main className="flex-grow bg-gradient-to-b from-lime-100 to-lime-200 py-8">
        <div className="w-full px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.values(cards).filter(card => card.visible).map(card => {
              const CardComponent = card.component
              return (<CardComponent key={card.key} />)
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

};

export default App;

