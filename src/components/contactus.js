import React, { useState } from "react";
import emailjs from "emailjs-com";
import contactUsImage from "../images/contact.svg";
import loadingGif from "../images/ajax-loader.gif";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResponseMessage("Sending...");

        // EmailJS Service and Template Info
        const serviceID = "your_service_id";   // From your EmailJS account
        const templateID = "your_template_id"; // From your EmailJS account
        const userID = "your_user_id";         // From your EmailJS account

        // Prepare the email data
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
        };

        try {
            // Send email via EmailJS
            const response = await emailjs.send(serviceID, templateID, templateParams, userID);
            setResponseMessage("Thank you for contacting us! We will get in touch shortly.");
            console.log("ok. response =", response?.data.message)
        } catch (error) {
            setResponseMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="w-full flex relative pt-18 pb-120 flex-col md:flex-row justify-between px-[5%]">
            <div className="relative items-center justify-center w-full lg:w-[50%]">
                <div className="w-[80%] lg:w-[98%] lg:pr-13">
                    <img src={contactUsImage} alt="contact" />
                </div>
            </div>
            <div className="relative flex-grow items-center justify-center w-full lg:w-[50%]">
                <div className="items-center justify-center">
                    <div className="pb-4">
                        <h5 className="font-semibold text-base leading-6 text-red-500 mt-4 md:text-lg md:leading-7">
                            Contact
                        </h5>
                        <h4 className="font-bold font-nunito text-xl leading-8 mt-4 md:text-3xl md:leading-10 mb-4 text-zinc-700">
                            Get In Touch
                        </h4>
                        <p className="text-zinc-500">
                            Send us a message by filling out the short form below, we will get back to you within 1 hour.
                            Alternatively, you can call us or WhatsApp on Mobile: <b>+256 781 224508</b>. Email: <b>engineering@mahanitech.com</b>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="w-full md:w-1/2 flex-item">
                                    <div className="mx-3">
                                        <div className="mt-8">
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md py-3 px-6 border border-solid border-body-color"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 flex-tem">
                                    <div className="mx-3">
                                        <div className="mt-8">
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md py-3 px-6 border border-solid border-body-color"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="mx-3">
                                    <div className="mt-8">
                                        <textarea
                                            name="message"
                                            placeholder="Message"
                                            rows="6"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md py-3 px-6 border border-solid border-body-color resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="mx-3">
                                    <div className="mt-6">
                                        {isLoading ? (
                                            <div className="text-blue-300 font-bold pb-4">
                                                <img src={loadingGif} width="20px" alt="Loading" />
                                            </div>
                                        ) : (
                                            <p className="form-message mx-3 text-center">{responseMessage}</p>
                                        )}
                                        <button type="submit" className="bg-red-500 text-white py-4 px-10 rounded-md hover:bg-red-400">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;