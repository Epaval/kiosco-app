 import Link from "next/link";

type ProductsPaginationProps = {
  page: number;
  totalPages: number;
};

export default function ProductsPagination({ page, totalPages }: ProductsPaginationProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white px-6 py-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Información de fecha y página */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Fecha:</span> {currentDate}
        </div>
        <div className="text-sm text-gray-600">
          Página <span className="font-semibold text-gray-900">{page}</span> de{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex items-center justify-between">
        {/* Botón Anterior */}
        <div>
          {page > 1 && (
            <Link
              href={`/admin/products?page=${page - 1}`}
              className="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </Link>
          )}
        </div>

        {/* Indicadores de página */}
        <div className="hidden sm:flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/products?page=${pageNumber}`}
              className={`inline-flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-lg transition-all duration-200 ${
                pageNumber === page
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </Link>
          ))}
        </div>

        {/* Información móvil de página */}
        <div className="sm:hidden text-sm font-medium text-gray-700">
          {page} / {totalPages}
        </div>

        {/* Botón Siguiente */}
        <div>
          {page < totalPages && (
            <Link
              href={`/admin/products?page=${page + 1}`}
              className="inline-flex items-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              Siguiente
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>

      {/* Botón Volver */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Panel
        </Link>
      </div>
    </div>
  );
}