const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Use POST for chat requests." }, 405);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request body." }, 400); }
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 12) {
    return json({ error: "Send between 1 and 12 chat messages." }, 400);
  }
  const messages = body.messages.map(m => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: String(m?.content ?? "").slice(0, 4000)
  })).filter(m => m.content.trim());
  if (!messages.length) return json({ error: "Your message is empty." }, 400);
  const system = {
    role: "system",
    content: "You are JARVIS, a helpful, respectful bilingual Tamil and English personal assistant. Reply in the language the user uses. Be clear, safe, and concise. Do not claim to control the user's phone or perform actions you cannot perform. Never ask for passwords, private keys, or sensitive account details."
  };
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const providers = [];
  if (openaiKey) providers.push({ name: "OpenAI", key: openaiKey, url: "https://api.openai.com/v1/chat/completions", model: process.env.OPENAI_MODEL || "gpt-4o-mini" });
  if (groqKey) providers.push({ name: "Groq", key: groqKey, url: "https://api.groq.com/openai/v1/chat/completions", model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile" });
  if (!providers.length) return json({ error: "AI is not connected yet. Add OPENAI_API_KEY or GROQ_API_KEY in your Netlify site environment variables, then redeploy." }, 503);

  const errors = [];
  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${provider.key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: provider.model, messages: [system, ...messages], max_tokens: 700 })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error?.message || `${provider.name} request failed (${response.status})`);
      const reply = data?.choices?.[0]?.message?.content;
      if (typeof reply !== "string" || !reply.trim()) throw new Error(`${provider.name} returned no text`);
      return json({ reply: reply.trim(), provider: provider.name });
    } catch (error) {
      errors.push(`${provider.name}: ${String(error.message || "request failed").slice(0, 180)}`);
    }
  }
  return json({ error: `AI providers could not answer. ${errors.join(" | ")}` }, 502);
};
