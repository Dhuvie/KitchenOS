export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export async function streamRecipe(
  prompt: string,
  history: any[],
  signal: AbortSignal,
  onBlock: (block: any) => void
): Promise<void> {
  const clientApiKey = localStorage.getItem('gravitas_gemini_key') || undefined;

  let response: Response;
  try {
    response = await fetch('/api/recipe/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, history, apiKey: clientApiKey }),
      signal
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('SERVER_UNREACHABLE', 'Unable to connect to the culinary backend server.');
  }

  if (!response.ok) {
    let errorCode = 'PROVIDER_ERROR';
    try {
      const errJson = await response.json();
      if (errJson?.code) errorCode = errJson.code;
    } catch {
      // not json
    }
    throw new ApiError(errorCode, `Server returned status ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError('NETWORK_ERROR', 'No stream available');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split('\n');
    
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.replace('data: ', '').trim();
        if (dataStr === '{}') continue; 
        try {
          const block = JSON.parse(dataStr);
          if (block.code === 'PROVIDER_ERROR') {
            throw new ApiError('PROVIDER_ERROR', 'Provider error in stream');
          }
          onBlock(block);
        } catch (e) {
          // Ignore malformed JSON chunks that might happen during stream
        }
      } else if (line.startsWith('event: error')) {
        throw new ApiError('PROVIDER_ERROR', 'Provider error');
      }
    }
  }
}
