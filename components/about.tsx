export function About() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="text-pretty">
                For over three decades, Bella Vista has been serving authentic Italian cuisine in the heart of downtown.
                Our passion for traditional recipes, combined with the finest imported ingredients, creates an
                unforgettable dining experience.
              </p>
              <p className="text-pretty">
                Our chef, trained in the hills of Tuscany, brings generations of culinary expertise to every dish. From
                our handmade pasta to our wood-fired pizzas, each meal is crafted with love and attention to detail.
              </p>
              <p className="text-pretty">
                Whether you're celebrating a special occasion or enjoying a casual dinner with friends, Bella Vista
                offers the perfect atmosphere for any gathering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/chef-preparing-fresh-pasta-in-restaurant-kitchen.jpg"
                alt="Chef preparing fresh pasta"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/elegant-restaurant-dining-room-with-warm-lighting.jpg"
                alt="Restaurant dining room"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img
                src="/fresh-ingredients-and-herbs-on-wooden-cutting-boar.jpg"
                alt="Fresh ingredients"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="/wood-fired-pizza-oven-flames.png"
                alt="Wood-fired oven"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
