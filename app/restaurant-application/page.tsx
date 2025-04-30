'use client';

import Image from 'next/image';
import RestaurantApplicationForm from '../components/RestaurantApplicationForm';

export default function RestaurantApplicationPage() {
  return (
    <>
      {/* Team Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Ekibimizle Tanışın
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
            Başvurunuz bu harika ekip tarafından değerlendirilecek. Deneyimli ekibimiz, restoranınızın dijital dönüşümünde yanınızda olacak.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4 relative mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-blue-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      <RestaurantApplicationForm />
    </>
  );
} 