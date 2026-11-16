# Earth Watcher — Sismic Observer

Panel web para explorar y visualizar terremotos recientes e históricos. La aplicación está construida con Angular y presenta los datos del backend en un mapa interactivo, tablas y gráficos.

## Enlaces

- **Aplicación desplegada:** [earth-watcher-mdp.netlify.app](https://earth-watcher-mdp.netlify.app/)
- **Repositorio del backend:** [MiriamDP/sismic-observer](https://github.com/MiriamDP/sismic-observer)

## Funcionalidades

- **Actividad reciente:** mapa con eventos recibidos en tiempo real, marcadores dimensionados por magnitud y coloreados por profundidad. La ficha de cada marcador muestra sus datos; los valores ausentes aparecen como `ND`. Al conectarse el usuario muestra los últimos 10 terremotos ocurridos y a partir de la sesión comienza a pintar nuevos terremos, en el mapa solo se muestran los 10 terremotos más recientes. Si durante la sesión llegan terremotos con fechas anteriores a los 10 primeros terremotos cargados estos son ignorados, en el mapa aunque si aparecen en la tabla resumen de eventos.
- **Histórico:** tabla paginada y filtros por país, fechas, magnitud y profundidad.
- **Métricas:** resúmenes, distribuciones temporales y por magnitud/profundidad, y ranking de países.
- **Comparación de periodos:** comparación de años para un intervalo del calendario, con filtros geográficos y de magnitud/profundidad. Los resultados dependen de que el backend tenga datos importados para ambos periodos.
- **Importaciones:** consulta y creación de trabajos de importación histórica, y visualización de su estado.
- **Estado de conexión:** muestra si la API está disponible; si la conexión falla, la interfaz informa del error.

El mapa utiliza Leaflet, teselas de OpenStreetMap y el catálogo geográfico local de países. La aplicación consume los datos del backend; no consulta directamente el catálogo de USGS desde el navegador.

## Arquitectura

```text
Navegador
   └── Panel Angular publicado en Netlify
         ├── API REST de consulta
         └── WebSocket para actualizaciones en tiempo real
                  └── Backend del repositorio sismic-observer
```

El panel es una SPA estática. Para mostrar datos reales, el backend y su túnel HTTPS deben estar activos y accesibles desde el navegador. Si el backend o el túnel se detienen, Netlify seguirá sirviendo la interfaz, pero no habrá nuevas consultas ni actualizaciones.

Consulta el [repositorio del backend](https://github.com/MiriamDP/sismic-observer) para conocer cómo configurar y arrancar sus servicios y el pipeline de datos.

## Ejecución local

Requisitos: Node.js y npm compatibles con Angular 21.

```bash
npm ci
npm start
```

Abre [http://localhost:4200](http://localhost:4200). La configuración inicial del panel está en [`public/config.json`](public/config.json); para desarrollo local, `apiUrl` debe apuntar a la dirección local de la API.

### Conectar con el backend

La aplicación carga `config.json` al iniciarse. Para conectar una instancia del backend:

1. Arranca el backend siguiendo sus instrucciones y obtén su URL pública HTTPS (por ejemplo, la URL proporcionada por ngrok).
2. Configura `apiUrl` en `public/config.json` con la URL base, sin incluir rutas como `/api`.
3. Usa el modo `api` y comprueba que el backend permita el origen del panel mediante CORS y exponga tanto la API HTTP como el WebSocket.
4. Reinicia el servidor de desarrollo o vuelve a compilar y desplegar el frontend.

Ejemplo de estructura de configuración:

```json
{
  "mode": "api",
  "max_earthquakes": 10,
  "apiUrl": "https://URL-PUBLICA-DEL-BACKEND",
  "refreshMs": 60000,
  "skipNgrokWarning": true
}
```

No incluyas credenciales ni el authtoken de ngrok en esta configuración. `skipNgrokWarning` permite añadir la cabecera que evita la página de aviso de ngrok cuando corresponda; no reemplaza CORS ni proporciona autenticación.

En modo API, el panel carga los eventos recientes mediante la API y recibe actualizaciones por WebSocket en `/ws/earthquakes`. Las páginas históricas, métricas, comparativas e importaciones utilizan los endpoints REST del backend. La URL debe ser HTTPS para el acceso desde Netlify.

## Compilación y pruebas

```bash
npm run build
npm test
```

La compilación de producción se genera en `dist/sismic-observer-panel/browser`.

## Despliegue en Netlify

El sitio publicado está disponible en [earth-watcher-mdp.netlify.app](https://earth-watcher-mdp.netlify.app/). Para compilar y publicar una versión:

1. Actualiza `apiUrl` en `public/config.json` con la URL HTTPS pública del backend que estará activo durante la demostración.
2. Ejecuta `npm ci` y `npm run build`.
3. Publica `dist/sismic-observer-panel/browser` como directorio del sitio.

El archivo [`public/_redirects`](public/_redirects) configura la redirección necesaria para que las rutas de Angular funcionen al recargar la página.

## Tecnologías

- Angular 21 y TypeScript
- Leaflet y `@bluehalo/ngx-leaflet`
- Chart.js
- RxJS
- Netlify para alojar el frontend
- FastAPI y el pipeline de datos en el [repositorio del backend](https://github.com/MiriamDP/sismic-observer)
