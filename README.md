# Vesta Garments — Meta Ads Dashboard

Dashboard de rendimiento publicitario conectado a datos reales de Meta Marketing API.

## Datos incluidos
- 31 días de métricas diarias (9 Mar – 8 Abr 2026)
- 5 campañas con datos diarios dinámicos
- 22 anuncios con métricas completas
- Selector de fechas con 6 presets + custom

## Despliegue en Vercel
1. Sube este proyecto a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) e importa el repositorio
3. Vercel detectará Vite automáticamente
4. Haz clic en "Deploy"
5. Listo — tu dashboard estará en `tu-proyecto.vercel.app`

## Desarrollo local
```bash
npm install
npm run dev
```

## Actualizar datos
Para actualizar con datos más recientes, ejecuta las consultas del Graph API Explorer
y actualiza los arrays de datos en `src/App.jsx`.

## Tech Stack
- React 18 + Vite
- Recharts (gráficos)
- Datos reales de Meta Marketing API v25.0
