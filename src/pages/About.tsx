
import React from "react";
import { Heading } from "@/components/ui/heading";

const About = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Story</h1>
        <p className="mt-2 text-gray-600">The journey of Impact for Change Initiative (ICI)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1456348832806-5b320416fc21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Organization founding" 
            className="rounded-lg shadow-md"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ngo-primary mb-4">Our Humble Beginnings</h2>
          <p className="text-gray-700 mb-4">
            Impact for Change Initiative (ICI) was founded with a vision to create a just, inclusive, and 
            sustainable society. Our dedicated team began with a mission to empower youth, advocate for 
            gender equality, promote mental health awareness, and take climate action.
          </p>
          <p className="text-gray-700">
            As our initiatives grew, we expanded our reach to serve more communities, focusing especially 
            on supporting Persons with Disabilities (PWDs), adolescent men and women, young mothers, and 
            vulnerable groups. Through dedication and support from partners, what began as a small effort has 
            grown into an organization that impacts thousands of lives every year.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-bold text-ngo-primary mb-4">Growth and Impact</h2>
          <p className="text-gray-700 mb-4">
            Over the years, ICI has empowered over 500 youth with education and vocational skills, 
            planted more than 1,000 trees through environmental conservation projects, and supported 
            over 100 survivors of Gender-Based Violence (GBV) with counseling, legal assistance, and reintegration.
          </p>
          <p className="text-gray-700">
            We've delivered over 200 mental health outreach programs, reaching thousands in need of 
            support and awareness, and provided accessible resources for more than 100 Persons with 
            Disabilities, ensuring their participation and opportunities in society.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Organization growth" 
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="bg-ngo-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-4">Our Target Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">Youth from marginalized communities</div>
          <div className="bg-white p-4 rounded-lg shadow-sm">Women and young mothers</div>
          <div className="bg-white p-4 rounded-lg shadow-sm">Persons with Disabilities (PWDs)</div>
          <div className="bg-white p-4 rounded-lg shadow-sm">Vulnerable groups</div>
          <div className="bg-white p-4 rounded-lg shadow-sm">Adolescent girls and boys</div>
          <div className="bg-white p-4 rounded-lg shadow-sm">GBV and mental health affected communities</div>
        </div>
      </div>

      <div className="bg-ngo-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-4">Partnerships and Stakeholders</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          ICI collaborates with local and international NGOs, government agencies, educational institutions, 
          community groups, and corporate partners to deliver its programs. Key stakeholders include:
        </p>
        <ul className="list-disc list-inside text-left max-w-lg mx-auto mt-4 text-gray-700">
          <li>Government bodies and policy makers</li>
          <li>International development organizations</li>
          <li>Local community-based organizations (CBOs)</li>
          <li>Educational institutions</li>
          <li>Private sector partners</li>
        </ul>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-ngo-primary mb-6">Why ICI?</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          At Impact for Change Initiative (ICI), we believe in a world where everyone, regardless of gender, 
          background, or ability, has access to opportunities that allow them to lead healthy, empowered lives. 
          Through our commitment to sustainable practices, social equity, and mental well-being, we aim to build 
          a community that fosters growth, opportunity, and resilience for all. By advocating for policies that 
          support these causes, ICI ensures that the voices of those most vulnerable are heard and that 
          transformative change is realized across communities.
        </p>
        <a 
          href="/volunteer" 
          className="inline-block bg-ngo-primary text-white px-6 py-3 rounded-md hover:bg-ngo-primary/90 transition-colors"
        >
          Join Our Cause
        </a>
      </div>
    </div>
  );
};

export default About;
