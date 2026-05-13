# Site Generator MVP

## Entregable de Semana 1
Pipeline minimo que transforma un brief en una landing HTML.

## Flujo
1. Usuario envia brief.
2. Servicio genera JSON de contenido (estructura + copy).
3. Renderer aplica plantilla HTML/CSS.
4. Se devuelve pagina final.

## Contrato de datos (entrada)
Ver site-spec.example.json.

## Estado actual del MVP (uso de IA con limites)
Este MVP ya incluye:
- Medicion de uso por cliente (generaciones e input/output tokens estimados).
- Limites mensuales por cliente para evitar abuso de la plataforma.
- Bloqueo preventivo cuando se supera el limite.
- Disclaimer de uso responsable inyectado en la pagina HTML generada.

## Ejecucion
Desde la raiz del repo:

```bash
node mvp/site-generator/generate-site.mjs \
	mvp/site-generator/site-spec.example.json \
	mvp/site-generator/output/clinica-sonrisa-viva.html
```

## Prueba tipo chat (Admin)
Tambien puedes probar el MVP desde el CMS, estilo chat builder:

1. Inicia el proyecto con `npm run dev`.
2. Entra a `/admin/site-generator`.
3. Escribe el mensaje del cliente.
4. Ajusta `clientId`, `projectName` e idioma.
5. Haz clic en "Generar sitio".

Resultado:
- Se genera un spec estructurado.
- Se crea un HTML en `public/mvp-output/`.
- Se muestra preview embebido en la misma pantalla.
- Se actualiza el uso por cliente en `mvp/site-generator/output/usage-state.json`.

## Datos de medicion
- Archivo de estado: mvp/site-generator/output/usage-state.json
- Se guarda por cliente y por mes:
	- generations
	- estimatedInputTokens
	- estimatedOutputTokens
	- lastGenerationAt

## Limites aplicados
Configurable en el spec de entrada (campo limits.ai):
- maxGenerationsPerMonth
- maxInputTokensPerMonth
- maxOutputTokensPerMonth

Si no se definen, se usan defaults seguros para MVP.

## Disclaimer en la pagina
Configurable en el spec de entrada (campo disclaimer):
- enabled: true/false
- text: texto del disclaimer

Recomendacion comercial/legal minima:
- Aclarar que la salida IA puede requerir revision humana.
- Prohibir uso para fraude, suplantacion, spam o actividad ilegal.
- Aclarar que el cliente es responsable del uso final y cumplimiento normativo.

## Definicion de hecho
- Un comando genera un archivo HTML en output/.
- El archivo renderiza correctamente en navegador.
- El CTA final es configurable por input.

## Proximo incremento
- Version 0.2: 3 estilos visuales.
- Version 0.3: publicacion automatica en subdominio.
- Version 0.4: panel admin con metrica por cliente y alertas de abuso.
