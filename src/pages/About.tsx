
import React from "react";
import { Heading } from "@/components/ui/heading";

const About = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-church-primary">Our Story</h1>
        <p className="mt-2 text-gray-600">The journey of GlobalCathedral Church</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1456348832806-5b320416fc21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Church founding" 
            className="rounded-lg shadow-md"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-church-primary mb-4">Our Humble Beginnings</h2>
          <p className="text-gray-700 mb-4">
            GlobalCathedral Church was founded in 1985 by Pastor James and Mary Wilson with just 12 members 
            meeting in their living room. Their vision was to create a welcoming community where people could 
            encounter God's love and be transformed by His grace.
          </p>
          <p className="text-gray-700">
            As the congregation grew, the church moved to a small rented hall in 1990, before finally 
            acquiring our current location in 1998. Through God's faithfulness, what began as a small 
            gathering has grown into a vibrant community of believers from all walks of life.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-bold text-church-primary mb-4">Growth and Impact</h2>
          <p className="text-gray-700 mb-4">
            Over the decades, GlobalCathedral has expanded its ministry beyond Sunday services to include 
            outreach programs, mission trips, and community service initiatives. Our food bank, established 
            in 2005, now serves over 200 families each month, while our youth programs provide mentorship 
            and guidance to the next generation.
          </p>
          <p className="text-gray-700">
            In 2015, we launched our first satellite campus, and today GlobalCathedral has a presence in 
            three locations throughout the region, with online services reaching people around the world.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Church growth" 
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="bg-church-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-church-primary mb-4">Our Vision for the Future</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          As we look ahead, we remain committed to our founding vision of creating a place where all people 
          can experience God's love. We continue to expand our digital ministry, deepen our community impact, 
          and raise up the next generation of leaders who will carry the message of hope to a world in need.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-church-primary mb-6">Join Us on the Journey</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Your story can become part of ours. We invite you to join us as we continue to write the 
          history of GlobalCathedral Church together, serving God and our community with love and dedication.
        </p>
        <a 
          href="/register" 
          className="inline-block bg-church-primary text-white px-6 py-3 rounded-md hover:bg-church-primary/90 transition-colors"
        >
          Become a Member
        </a>
      </div>
    </div>
  );
};

export default About;
