import React from 'react';
import "./index.css";


import RentalUnit from './components/rentalUnit';
import Header from './components/header';
import Footer from './components/footer';

const App = () => {
  const rentalUnits = [
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/imge5.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img2.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img3.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img4.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
      ],
      title: "Beautiful 3-Bedroom House",
      location: "123 Elm Street, Springfield",
      price: "$2,000/month",
      description: "This is a beautiful 3-bedroom house located in a quiet neighborhood. It features a large living room, a modern kitchen, and a spacious backyard perfect for family gatherings.",
      contact: {
        phone: "123-456-7890",
        email: "owner@example.com"
      }
    },
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img6.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img7.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img9.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img10.jpeg",
      ],
      title: "Self contained-single rooms",
      location: "456 Oak Street, Springfield",
      price: "$1,500/month",
      description: "This 2-bedroom apartment offers modern amenities, with a spacious living area, new appliances, and great access to public transportation.",
      contact: {
        phone: "987-654-3210",
        email: "apartmentowner@example.com"
      }
    },
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img3.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img2.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/imge5.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img4.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
      ],
      title: "Beautiful 3-Bedroom House",
      location: "123 Elm Street, Springfield",
      price: "$2,000/month",
      description: "This is a beautiful 3-bedroom house located in a quiet neighborhood. It features a large living room, a modern kitchen, and a spacious backyard perfect for family gatherings.",
      contact: {
        phone: "123-456-7890",
        email: "owner@example.com"
      }
    },
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img9.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img7.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img6.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img10.jpeg",
      ],
      title: "Modern 2-Bedroom Apartment",
      location: "456 Oak Street, Springfield",
      price: "$1,500/month",
      description: "This 2-bedroom apartment offers modern amenities, with a spacious living area, new appliances, and great access to public transportation.",
      contact: {
        phone: "987-654-3210",
        email: "apartmentowner@example.com"
      }
    },
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img2.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img3.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/imge5.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img4.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
      ],
      title: "Beautiful 3-Bedroom House",
      location: "123 Elm Street, Springfield",
      price: "$2,000/month",
      description: "This is a beautiful 3-bedroom house located in a quiet neighborhood. It features a large living room, a modern kitchen, and a spacious backyard perfect for family gatherings.",
      contact: {
        phone: "123-456-7890",
        email: "owner@example.com"
      }
    },
    {
      mainImage: "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img10.jpeg",
      thumbnails: [
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img9.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img8.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img6.jpeg",
        "https://storage.googleapis.com/reech-gcp-assets-repo/rentals-pics/img10.jpeg",
      ],
      title: "Modern 2-Bedroom Apartment",
      location: "456 Oak Street, Springfield",
      price: "$1,500/month",
      description: "This 2-bedroom apartment offers modern amenities, with a spacious living area, new appliances, and great access to public transportation.",
      contact: {
        phone: "987-654-3210",
        email: "apartmentowner@example.com"
      }
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <section className="bg-gradient-to-b from-lime-100 to-lime-200 py-8">
        <div className="w-full px-[5%]">
          {/* Grid for RentalUnit components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rentalUnits.map((unit, index) => (
              <RentalUnit key={index} unit={unit} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
