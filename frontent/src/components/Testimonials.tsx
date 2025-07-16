
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    content: 'I\'ve been shopping here for years and the quality of the products has always been exceptional. The customer service is top-notch too!',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Enthusiast',
    content: 'As someone who buys a lot of electronics, I appreciate the competitive prices and extensive selection. My orders always arrive quickly and in perfect condition.',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Fashion Blogger',
    content: 'ShopEase has become my go-to for trendy fashion pieces. Their clothing collection is constantly updated with the latest styles at affordable prices.',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
  },
];

const Testimonials = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2 text-center">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-10">Don't just take our word for it - hear from our satisfied customers.</p>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4 text-amber-500 flex">
                {Array(5).fill(null).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
