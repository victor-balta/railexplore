import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing DEEPSEEK_API_KEY environment variable in Netlify" }), { status: 500 });
    }

    // Extract the target path. 
    // Example: /.netlify/functions/deepseek/v1/chat/completions -> /v1/chat/completions
    const url = new URL(req.url);
    const targetPath = url.pathname.replace('/.netlify/functions/deepseek', '');
    const targetUrl = `https://api.deepseek.com${targetPath}`;

    // Forward the POST body
    const requestBody = await req.text();

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: requestBody || undefined
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const config: Config = {
  path: "/.netlify/functions/deepseek/*"
};
