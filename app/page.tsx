 import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-black text-amber-900 mb-6 leading-tight">
          ¡Bienvenido a <span className="text-orange-600">MinutoCero</span>!
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl">
          Comida rápida, fresca y deliciosa. 
          Hecha para ti, entregada a tiempo.
        </p>

        {/* Botón que lleva a la página con ProductCard */}
        <Link href="/order/cafe">
          <button className="bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300">
            🍔 Ver el Menú
          </button>
        </Link>
      </section>

      {/* Imagen destacada */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Comida rápida deliciosa"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <p className="text-white text-2xl md:text-3xl font-bold">Listo en menos de 30 minutos ⚡</p>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-6 text-center text-gray-600">
        © 2025 FastBite. Todos los derechos reservados.
      </footer>
    </div>
  );
}