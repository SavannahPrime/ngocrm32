
import React from "react";

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
  descriptionClassName?: string;
  center?: boolean;
}

export const Heading = ({
  title,
  description,
  className = "",
  descriptionClassName = "",
  center = false,
}: HeadingProps) => {
  return (
    <div className={`${center ? "text-center" : ""} mb-6 ${className}`}>
      <h1 className="text-3xl font-bold font-serif text-church-primary">{title}</h1>
      {description && (
        <p className={`mt-2 text-gray-600 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};
