import React, { useState } from 'react';
import image1 from "../images/works/bms-dashbard.png";
import image2 from "../images/works/bms-desktop-computer.png";
import image3 from "../images/works/bms-on-ipadAir.png";
import image4 from "../images/works/bms-new-invoice-smallestphone.png";
import image5 from "../images/works/bms-payments-on-ipadAir.png";
import image6 from "../images/works/bms-on-ipadAir.png";
import image7 from "../images/works/bms-stocksales.png";

import TinySlider from "tiny-slider-react";
import 'tiny-slider/dist/tiny-slider.css';

const WorkSection = () => {

    const [settings] = useState({
        lazyload: true,
        nav: false,
        mouseDrag: true,
        controls: false,
        mode: "carousel"
    });

    const worksData = [
        {
            imgSrc: image1,
            title: "Mahani Business Manager",
            description: "Manage all business operations including Sales, Stock, Supplies, Employees, etc."
        },
        {
            imgSrc: image2,
            title: "Desktop View",
            description: "Mahani Business Manager on a desktop computer"
        },
        {
            imgSrc: image3,
            title: "Tablet view",
            description: "Mahani Business Manager on a tablet"
        },
        {
            imgSrc: image4,
            title: "Mobile view",
            description: "On a mobile phone, for portability."
        },
        {
            imgSrc: image5,
            title: "Tabular view of Mahani Business Manager",
            description: "User friendly forms for entering information into your system. Employees find it enjoyable."
        },
        {
            imgSrc: image6,
            title: "Dynamic graphs, business analysis",
            description: "For data science in business. Use scientifically proven methods of analyzing the performance of your business."
        },
        {
            imgSrc: image7,
            title: "Summaries on the dashboard",
            description: "Viewing your entire business on a single page"
        },
    ];

    return (
        <section id="work" className="w-full bg-gray pt-120 pb-120">
            <div className="container">
                <div className="row justify-center">
                    <div className="w-full lg:w-1/2">
                        <div className="section_title text-center pb-6">
                            <h5 className="sub_title">Works</h5>
                            <h4 className="main_title">Some of Our Recent Works</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full relative">
                    <TinySlider settings={settings}>
                        {worksData.map((work, index) => (
                            <div key={index} className="w-full lg:w-1/4 flex border border-dashed">
                                <div className="single_item mx-auto">
                                    <div className="mx-3">
                                        <div className="work_image">
                                            <img src={work.imgSrc} alt={work.title} className="w-full tns-lazy" />
                                        </div>
                                        <div className="work_content">
                                            <a href="#" className="arrow">
                                                <i className="lni lni-chevron-right"></i>
                                            </a>
                                            <h4 className="work_title text-xl md:text-2xl">
                                                <a href="#">{work.title}</a>
                                            </h4>
                                            <p className="mt-2">{work.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TinySlider>
                </div>
            </div>
        </section>
    );
}

export default WorkSection;