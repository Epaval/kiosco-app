 ## Para las migraciones
 npx prisma migrate dev
 ## Abrir la conslo de Prisma Studio
 npx prisma studio

 ## Comenzar el proyecto 
 npm run dev

 ## Para insertar multiples valores a la base de datos 
 npx prisma db seed
 ? Debes crear el archivo en carpeta prisma los archivos .ts con los datos a insertar
 y en prisma.confg.ts incluir el seed

 """
 import { defineConfig, env } from "prisma/config";
import "dotenv/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts" # esta linea es importante
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

 """ 
 
 """
 import { categories } from "./data/categories";
import { products } from "./data/products";
import { PrismaClient} from "@/src/generated/prisma/client";

const prisma = new PrismaClient()

async function main() {

    try {

        await prisma.category.createMany({
            data: categories
        })
        await prisma.product.createMany({
            data: products
        })
        console.log("Seed Ejecutado Correctamente")
        
    } catch (error) {
        console.log(error)
    }
    
}
main()
    .then( async () => {
        await prisma.$disconnect
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect
        process.exit(1)
    })
 """

 ## Para resetear los datos en la BD 
 npx prisma migrate reset

 ## Dependencias
├── @heroicons/react@2.2.0
├── @prisma/client@6.19.0
├── @types/node@20.19.25
├── @types/react-dom@18.3.7
├── @types/react@18.3.26
├── dotenv@17.2.3
├── eslint-config-next@14.2.33
├── eslint@8.57.1
├── next@14.2.33
├── postcss@8.5.6
├── prisma@6.19.0
├── react-dom@18.3.1
├── react-toastify@11.0.5
├── react@18.3.1
├── tailwindcss@3.4.18
├── tsx@4.20.6
├── typescript@5.9.3
├── zod@4.1.12
└── zustand@5.0.8