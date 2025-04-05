
import React from "react";
import { Heading } from "@/components/ui/heading";

const About = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Story</h1>
        <p className="mt-2 text-gray-600">The journey of HopeHarbor</p>
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
            HopeHarbor was founded in 2005 by Sarah Johnson and David Chen with just a small team of 
            passionate individuals dedicated to making a difference. Their vision was to create sustainable 
            solutions for communities facing challenges around the world.
          </p>
          <p className="text-gray-700">
            As our initiatives grew, we expanded from a small office to multiple field operations across 
            three continents. Through dedication and support from donors worldwide, what began as a small 
            effort has grown into an organization that impacts thousands of lives every year.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-bold text-ngo-primary mb-4">Growth and Impact</h2>
          <p className="text-gray-700 mb-4">
            Over the years, HopeHarbor has expanded its programs beyond emergency relief to include 
            long-term development projects, education initiatives, and community empowerment programs. 
            Our clean water projects now serve over 50 communities, while our education programs have 
            helped build or renovate more than 25 schools in underserved regions.
          </p>
          <p className="text-gray-700">
            In 2015, we launched our first environmental sustainability initiative, and today 
            HopeHarbor leads conservation efforts in critical ecosystems while supporting local 
            communities through sustainable livelihood programs.
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
        <h2 className="text-2xl font-bold text-ngo-primary mb-4">Our Vision for the Future</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          As we look ahead, we remain committed to our founding vision of creating sustainable solutions and 
          empowering communities. We continue to expand our global reach, strengthen our partnerships, and 
          innovate in our approach to address the most pressing challenges facing vulnerable communities around the world.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-ngo-primary mb-6">Join Us on the Journey</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Your story can become part of ours. We invite you to join us as we continue to write the 
          history of HopeHarbor together, serving communities with compassion and creating lasting change.
        </p>
        <a 
          href="/volunteer" 
          className="inline-block bg-ngo-primary text-white px-6 py-3 rounded-md hover:bg-ngo-primary/90 transition-colors"
        >
          Become a Volunteer
        </a>
      </div>
    </div>
  );
};

export default About;
