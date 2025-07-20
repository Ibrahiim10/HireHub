import React, { useEffect, useRef } from 'react';
import fatima from '../assets/fatima.png';
import shuceib from '../assets/shuceib.jpg';
import ibrahim from '../assets/ibrahim.jpg';
import dacar from '../assets/dacar.jpg';
import anis from '../assets/anis.jpg';
import victor from '../assets/victor.jpg';

import kenyaFlag from '../assets/flags/ken.png';
import somaliaFlag from '../assets/flags/som.png';
import UkFlag from '../assets/flags/uk.png';
import SomlandFlag from '../assets/flags/somland.png';

const testimonials = [
  {
    name: 'Fatima A.',
    role: 'Frontend Developer',
    country: 'Kenya',
    flag: kenyaFlag,
    quote: 'Thanks to JobHunt, I landed my dream job in less than 2 weeks!',
    image: fatima,
  },
  {
    name: 'Shuceib',
    role: 'Hiring Manager',
    country: 'Somalia',
    flag: somaliaFlag,
    quote:
      'We received high-quality applicants within hours. This is our go-to platform.',
    image: shuceib,
  },
  {
    name: 'Ibrahim B.',
    role: 'Junior Developer',
    country: 'Kenya',
    flag: kenyaFlag,
    quote:
      'JobHunt connected me to great companies that I never imagined applying to.',
    image: ibrahim,
  },
  {
    name: 'AhmedNor',
    role: 'Junior Developer',
    country: 'Somaliland',
    flag: SomlandFlag,
    quote:
      'With JobHunt, I finally felt seen as a developer starting out. Highly recommend!',
    image: dacar,
  },
  {
    name: 'Anis Abdi',
    role: 'Junior Developer',
    country: 'Uk',
    flag: UkFlag,
    quote:
      'This platform gave me exposure to recruiters from different countries. Amazing!',
    image: anis,
  },
  {
    name: 'Victor',
    role: 'Junior Developer',
    country: 'Kenya',
    flag: kenyaFlag,
    quote:
      'The application process was seamless, and I got hired faster than expected!',
    image: victor,
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let direction = 1;

    const interval = setInterval(() => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += direction;

      if (
        scrollContainer.scrollLeft + scrollContainer.offsetWidth >=
          scrollContainer.scrollWidth ||
        scrollContainer.scrollLeft <= 0
      ) {
        direction *= -1;
      }
    }, 20); // scroll speed

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        What Our Users Say
      </h2>
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-6 w-max">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-[280px] max-w-[320px] bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mt-1"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{testimonial.role}</span>
                    <img
                      src={testimonial.flag}
                      alt={testimonial.country}
                      className="w-5 h-3 object-cover rounded-sm"
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">“{testimonial.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
