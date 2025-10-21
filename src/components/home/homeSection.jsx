"use client"

import ApiFunction from "@/lib/api/apiFuntions";
import { useEffect, useState } from "react";

export function HomeSection() {
  const { get, } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [sectionCard, setsectionCard] = useState([]);

  const handleGet = async () => {
    setIsLoading(true)
    await get(`content/all`)
      .then((result) => {
        if (result) {
          console.log(result);

          setsectionCard(result.data)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleGet()
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Metal Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience excellence in every aspect of our service, from premium materials to expert delivery
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:grid-cols-2">
          {sectionCard?.map((card, index) => (
            <div
              key={card.title}
              className="group relative h-80 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInUp 0.8s ease-out forwards'
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${card.image})`,
                }}
              />

              {/* Base overlay - always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* Hover overlay with backdrop blur */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Animated border glow */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-500" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 z-10">
                {/* Description - always visible but enhanced on hover */}
                <div className="transform translate-y-0 group-hover:translate-y-[-8px] transition-transform duration-500 delay-150 ckeditor-content" dangerouslySetInnerHTML={{ __html: card.description || '' }}></div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* Corner accent dot */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/0 group-hover:bg-white/80 rounded-full transition-all duration-500 delay-200" />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Staggered entrance animations */
        .group:nth-child(1) { animation-delay: 0s; }
        .group:nth-child(2) { animation-delay: 0.1s; }
        .group:nth-child(3) { animation-delay: 0.2s; }
        .group:nth-child(4) { animation-delay: 0.3s; }
        .group:nth-child(5) { animation-delay: 0.4s; }
        .group:nth-child(6) { animation-delay: 0.5s; }

        /* Custom backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .group:hover .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
        }

        /* Enhanced hover states */
        .group:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}