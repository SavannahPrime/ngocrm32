
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";

const Beliefs = () => {
  const beliefs = [
    {
      title: "The Bible",
      description: "We believe the Bible is the inspired, infallible Word of God, the supreme authority for faith and life.",
    },
    {
      title: "God",
      description: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.",
    },
    {
      title: "Jesus Christ",
      description: "We believe in the deity of Jesus Christ, His virgin birth, sinless life, miracles, atoning death, bodily resurrection, and His return in power and glory.",
    },
    {
      title: "Holy Spirit",
      description: "We believe in the present ministry of the Holy Spirit by whose indwelling Christians are enabled to live godly lives.",
    },
    {
      title: "Salvation",
      description: "We believe salvation is a gift from God received through faith in Jesus Christ alone.",
    },
    {
      title: "The Church",
      description: "We believe the Church is the body of Christ comprised of all believers with the mission to worship God and make disciples.",
    },
    {
      title: "Prayer",
      description: "We believe prayer is essential for developing a relationship with God and effective Christian service.",
    },
    {
      title: "Eternity",
      description: "We believe in the resurrection of both the saved and the lost—the saved to eternal life, and the lost to eternal separation from God.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-church-primary">Our Beliefs</h1>
        <p className="mt-2 text-gray-600">The foundations of our faith and ministry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {beliefs.map((belief, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-church-primary mb-3">{belief.title}</h2>
              <p className="text-gray-700">{belief.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-church-light p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-church-primary mb-4 text-center">Our Mission</h2>
        <p className="text-center text-gray-700 max-w-3xl mx-auto">
          At GlobalCathedral, our mission is to lead people to become fully devoted followers of Christ, 
          building a community of love, faith, and service that glorifies God and transforms lives.
        </p>
      </div>
    </div>
  );
};

export default Beliefs;
