This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Conexión con la API

Copia `.env.local.example` a `.env.local` y configura `API_URL` con la URL del backend (localmente, `http://localhost:5000`). Mantén el backend encendido y reinicia Next.js después de cambiar esta configuración. En producción, configura la URL de un backend que tenga acceso a la base de datos antes de generar el build.

El navegador consulta `/api/pruebas` en el frontend y Next.js reenvía las peticiones al backend, tanto para la lista como para el detalle. Así, al acceder desde un celular, `localhost:5000` se resuelve en el servidor de Next.js. No es necesario exponer la base de datos ni configurar CORS para cada dispositivo.

Si la API responde HTTP 500, revisa los registros del backend y su configuración de base de datos; cambiar la URL del frontend no corrige un error interno de la API.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
