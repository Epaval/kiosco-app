 'use client'

import { ProductsWithCategory } from "@/app/admin/products/page";
import { Product } from "@/src/generated/prisma/client";
import { formatCurrency } from "@/src/utils";
import Link from "next/link";
import { useState, useMemo } from "react";

type ProductTableProps = {
  products: ProductsWithCategory;
  allProducts?: ProductsWithCategory;  
};

export default function ProductTable({ products, allProducts }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

   
  const productsToSearch = allProducts || products;

   
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products; 
    }
    
    return productsToSearch.filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
      );
    });
  }, [products, productsToSearch, searchTerm]);

  // Estadísticas de resultados
  const resultsCount = filteredProducts.length;
  const totalCount = productsToSearch.length;
  const isSearching = searchTerm.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Gestión de Productos
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSearching 
              ? `Buscando en todos los productos (${totalCount} total)`
              : "Lista completa de productos disponibles en tu catálogo"
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="max-w-2xl">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar en todos los productos
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 transition-colors duration-200"
              placeholder="Buscar por nombre, categoría o ID en todos los productos..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isSearching ? (
              <>
                Encontrados <span className="font-semibold text-gray-900">{resultsCount}</span> de{" "}
                <span className="font-semibold text-gray-900">{totalCount}</span> productos
              </>
            ) : (
              <>
                Mostrando <span className="font-semibold text-gray-900">{resultsCount}</span> productos de esta página
              </>
            )}
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {filteredProducts.length > 0 ? (
              <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      >
                        Producto
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      >
                        Precio
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      >
                        Categoría
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="relative py-4 pl-3 pr-6 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="whitespace-nowrap py-5 pl-6 pr-3">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4">
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-5">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                            {formatCurrency(product.price)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-sm text-gray-700">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-5">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Activo
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-6 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </Link>
                            <button className="inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors duration-200">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Estado cuando no hay resultados
              <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-100 py-16 px-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron productos</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {searchTerm 
                    ? "No hay productos que coincidan con tu búsqueda en todos los registros. Intenta con otros términos."
                    : "No hay productos disponibles en esta página."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors duration-200"
                  >
                    Mostrar productos de esta página
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}