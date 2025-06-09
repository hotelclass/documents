```javascript

//Código en javascript para invocar openai: pregunta, búsqueda, contexto, funciones, resultado.
embedding = embed("¿A qué hora cierra la piscina?");
embedding = embed("¿Puedo reservar la piscina ahora?");


const messages = [
  { role: "system", content: "Sos un asistente que responde según los documentos internos." },
  { role: "user", content: `Pregunta: ${pregunta}\n\nContexto:\n${contexto}` }
];

const completion = await openai.chat.completions.create({
  model: "gpt-4", // o el que uses
  messages,
  temperature: 0.3,
});
```

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Respondé en base al contexto proporcionado. Si la información no está disponible, indicá que no se sabe."
    },
    {
      "role": "user",
      "content": "¿A qué hora cierra la piscina?"
    },
    {
      "role": "assistant",
      "content": "Según el contexto, la piscina está disponible hasta las 22:00 todos los días."
    }
  ]
}
```


