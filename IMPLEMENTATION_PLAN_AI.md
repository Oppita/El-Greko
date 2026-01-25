# Plan de Integración Multi-IA (Groq, OpenAI, xAI Grok)

Para dotar a **El Greko** de redundancia total y evitar bloqueos por cuotas, implementaremos un sistema de orquestación multi-proveedor.

## 🎯 Objetivos
1.  **Estabilizar Groq**: Corregir la inyección de llaves y asegurar el formato JSON.
2.  **Añadir ChatGPT (OpenAI)**: Integrar GPT-4o para auditorías de alta precisión.
3.  **Añadir Grok (xAI)**: Integrar Grok-1 para análisis técnicos rápidos y sin censura.
4.  **UI Unificada**: Permitir al usuario elegir el "cerebro" de la auditoría desde el panel principal.

---

## 🛠️ Fase 1: Servicios de API Estandarizados
Crearemos un motor para cada proveedor bajo una interfaz común para que el Dashboard no note la diferencia.

- [ ] **OpenAI Service**: `services/openaiService.ts` (Model: `gpt-4o`).
- [ ] **xAI Service**: `services/xaiService.ts` (Model: `grok-1`).
- [ ] **Groq (Mejora)**: Refactorizar `services/groqService.ts` para mejor manejo de errores.

## 🧠 Fase 2: Orquestador Maestro (The "Brain")
Actualizaremos `geminiService.ts` para que actúe como un **AI Gateway**.
- Si Gemini falla (429/404), saltará automáticamente al siguiente proveedor disponible (Failover).
- Centralización del `SYSTEM_INSTRUCTION` para que todos los modelos respondan con el mismo rigor de la UNGRD.

## 🖥️ Fase 3: Interfaz de Usuario (InputSection)
- Añadir botones de selección para: **Gemini**, **Groq**, **ChatGPT**, **Grok**.
- Indicadores visuales de "Salud de API" (Verde si responde, Rojo si hay error).

## 🚀 Fase 4: Despliegue Robusto (CI/CD)
Actualizar `.github/workflows/deploy.yml` para incluir las llaves de todos los proveedores:
- `VITE_GROQ_API_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_XAI_API_KEY`

---

## 🛑 ¿Por qué falló Groq en la prueba anterior?
He detectado que la variable `VITE_GROQ_API_KEY` **no está configurada en los GitHub Secrets** ni en el archivo de despliegue `deploy.yml`. Por lo tanto, el sitio web en vivo "no tiene llaves" para usar Groq.
