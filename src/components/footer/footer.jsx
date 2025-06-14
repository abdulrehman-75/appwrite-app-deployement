import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../logos/logo';

const footerLinks = [
    {
        heading: "Company",
        links: ["Features", "Pricing", "Affiliate Program", "Press Kit"]
    },
    {
        heading: "Support",
        links: ["Account", "Help", "Contact Us", "Customer Support"]
    },
    {
        heading: "Legals",
        links: ["Terms & Conditions", "Privacy Policy", "Licensing"]
    }
];

function Footer() {
    return (
        <section className="relative py-10 text-white bg-black border-t-2 border-orange-500">
            <div className="relative z-10 px-4 mx-auto max-w-7xl">
                <div className="flex flex-wrap -mx-6 gap-y-10">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex flex-col gap-4">
                            <div className="inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                            <p className="text-sm text-gray-400">
                                &copy; 2025 DevUI. All Rights Reserved.
                            </p>
                        </div>
                    </div>

                    {footerLinks.map((section, idx) => (
                        <div key={idx} className="w-full p-6 sm:w-1/2 lg:w-2/12">
                            <div>
                                <h3 className="mb-6 text-xs font-semibold tracking-wider text-orange-400 uppercase">
                                    {section.heading}
                                </h3>
                                <ul>
                                    {section.links.map((link, index) => (
                                        <li key={index} className="mb-3">
                                            <Link
                                                to="/"
                                                className="text-base font-medium text-white transition-colors hover:text-orange-400"
                                            >
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Footer;
