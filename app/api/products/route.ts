 import { prisma } from "@/src/lib/prisma"
 

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
     

    // Validar datos básicos
    if (!data.name || !data.price || !data.categoryId || !data.image) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Todos los campos son requeridos" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Convertir categoryId a número
    const categoryId = parseInt(data.categoryId)
    if (isNaN(categoryId)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "ID de categoría inválido" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Convertir price a número
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Precio inválido" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar que la categoría existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!categoryExists) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "La categoría seleccionada no existe" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        price: price,
        categoryId: categoryId,
        image: data.image.trim()
      },
      include: {
        category: true
      }
    })

    

    // Respuesta de éxito
    return new Response(
      JSON.stringify({
        success: true,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category.name
        },
        message: "Producto creado exitosamente"
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )

  } catch (error: any) {
    console.error('❌ Error completo al crear producto:', error)

    
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Ya existe un producto con ese nombre" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (error.code === 'P2003') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "La categoría seleccionada no existe" 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Error genérico
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Error interno del servidor al crear el producto" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// También agregar método OPTIONS para CORS si es necesario
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}