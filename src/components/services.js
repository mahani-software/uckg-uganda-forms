import React from 'react';

const ServicesSection = () => {
    const servicesData = [
        {
            icon: "lni lni-layout",
            title: "Backend systems development",
            description: "We develop custom APIs and integrate with other public and/or private REST or GraphQL APIs.",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        },
        {
            icon: "lni lni-bullhorn",
            title: "DevOps engineering",
            description: "CI/CD pipelines, GCP services, AWS Cloud, DigitalOcean, Heroku, Github actions, Kubernetes, Docker, Terraform, Ansible, NGiNX, TYK API gateway, CircleCI, Shell scripting, Sentry logging, etc",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        },
        {
            icon: "lni lni-mobile",
            title: "Servers monitoring & maintenance",
            description: "We manage all server side complexity of software systems. All protocols, all network layers, all backend programming technologies.",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        },
        {
            icon: "lni lni-seo",
            title: "Software Systems Architecting",
            description: "Perfect engineering follows a well designed and documented plan of what is to be built. Are you a software developer too busy to document a complete architecture of your project? We can help.",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        },
        {
            icon: "lni lni-layers",
            title: "Desktop software dev't & packaging",
            description: "We mainly use Electron-JS and GTK technologies to develop desktop software for Windows OS, Mac OS, and Linux. We maximise the power of WebSockets to develop admin dashboards with real-time monitoring capability.",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        },
        {
            icon: "lni lni-briefcase",
            title: "React/Native Frontend Apps Development",
            description: "Highly dynamic and light-weight web based systems and mobile applications, using React and React Native. We mastered the technicalities of React, React-Native, Redux, Routers, etc. We also develop React libraries.",
            svgPath: "M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
        }
    ];

    return (
        <section id="services" className="py-120">
            <div className="container">
                <div className="row justify-center">
                    <div className="w-full lg:w-1/2">
                        <div className="section_title text-center pb-6">
                            <h5 className="font-semibold text-base leading-6 text-red-500 mt-4 md:text-lg md:leading-7">
                                What We Do
                            </h5>
                            <h4 className="font-bold font-nunito text-xl leading-8 mt-4 md:text-3xl md:leading-10 mb-4 text-zinc-700">
                                Our Services
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3 3xl:grid-cols-4 3xl:gap-3 justify-center">
                    {servicesData.map((service, index) => (
                        <div key={index} className="w-full">
                            <div className="border-2 border-dashed border-border-color rounded-xl py-13 px-6 sm:py-6 sm:px-4 md:py-13 md:px-6 transition-all duration-300 hover:border-theme-color hover:shadow text-center mt-8 mx-3">
                                <div className="relative inline-block">
                                    <i className={service.icon}></i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="92" viewBox="0 0 94 92">
                                        <path className="fill-[#fff1f1] transition-all duration-300" d={service.svgPath} />
                                    </svg>
                                </div>
                                <div className="services_content mt-5 xl:mt-10">
                                    <h3 className="font-bold font-nunito text-xl md:text-2xl text-zinc-500">
                                        {service.title}
                                    </h3>
                                    <p className="mt-4 text-zinc-500">{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;