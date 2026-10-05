import { NextResponse } from 'next/server';

interface CriterionInput {
  nom: string;
  note: string;
  commentaire: string;
}

interface EvaluationInput {
  poste: string;
  criteres: CriterionInput[];
  appreciationGenerale: string;
  pointsForts: string;
  axesAmelioration: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isText = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.length <= maxLength;

function validateEvaluation(value: unknown): EvaluationInput | null {
  if (
    !isRecord(value) ||
    !isText(value.poste, 200) ||
    !isText(value.appreciationGenerale, 3000) ||
    !isText(value.pointsForts, 2000) ||
    !isText(value.axesAmelioration, 2000) ||
    !Array.isArray(value.criteres) ||
    value.criteres.length === 0 ||
    value.criteres.length > 40
  ) {
    return null;
  }

  const criteres: CriterionInput[] = [];
  for (const criterion of value.criteres) {
    if (
      !isRecord(criterion) ||
      !isText(criterion.nom, 200) ||
      !isText(criterion.note, 40) ||
      !isText(criterion.commentaire, 1000)
    ) {
      return null;
    }

    criteres.push({
      nom: criterion.nom,
      note: criterion.note,
      commentaire: criterion.commentaire,
    });
  }

  const hasEvaluationData =
    criteres.some((criterion) => criterion.note !== 'Non évalué' || criterion.commentaire.trim()) ||
    value.appreciationGenerale.trim() ||
    value.pointsForts.trim() ||
    value.axesAmelioration.trim();

  if (!hasEvaluationData) return null;

  return {
    poste: value.poste,
    criteres,
    appreciationGenerale: value.appreciationGenerale,
    pointsForts: value.pointsForts,
    axesAmelioration: value.axesAmelioration,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Le service IA n’est pas configuré. Ajoutez OPENAI_API_KEY au fichier .env.local.' },
      { status: 503 }
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 32_000) {
    return NextResponse.json({ error: 'Les données envoyées sont trop volumineuses.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'La requête reçue est invalide.' }, { status: 400 });
  }

  if (JSON.stringify(body).length > 32_000) {
    return NextResponse.json({ error: 'Les données envoyées sont trop volumineuses.' }, { status: 413 });
  }

  const evaluation = validateEvaluation(body);
  if (!evaluation) {
    return NextResponse.json(
      { error: 'Renseignez au moins une note, un commentaire ou une appréciation avant de lancer l’analyse.' },
      { status: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Tu aides un responsable RH à rédiger une synthèse d’évaluation. Réponds en français, de façon factuelle, constructive et fondée uniquement sur les éléments fournis. N’invente aucun fait et signale les informations insuffisantes. Ne prends aucune décision d’embauche, de renouvellement ou de rupture; tes suggestions doivent toujours être vérifiées par un humain.',
          },
          { role: 'user', content: JSON.stringify(evaluation) },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'evaluation_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                pointsForts: { type: 'array', items: { type: 'string' } },
                axesAmelioration: { type: 'array', items: { type: 'string' } },
                planAccompagnement: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      action: { type: 'string' },
                      objectif: { type: 'string' },
                      echeance: { type: 'string' },
                      moyens: { type: 'string' },
                    },
                    required: ['action', 'objectif', 'echeance', 'moyens'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['pointsForts', 'axesAmelioration', 'planAccompagnement'],
              additionalProperties: false,
            },
          },
        },
        max_tokens: 1200,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return NextResponse.json(
      { error: 'Impossible de joindre le service IA pour le moment. Réessayez dans quelques instants.' },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Le service IA n’a pas pu générer l’analyse. Vérifiez la configuration OpenAI et réessayez.' },
      { status: 502 }
    );
  }

  let completion: { choices?: { message?: { content?: string | null } }[] };
  try {
    completion = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
  } catch {
    return NextResponse.json({ error: 'La réponse du service IA est invalide.' }, { status: 502 });
  }

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: 'Le service IA a renvoyé une réponse vide.' }, { status: 502 });
  }

  try {
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: 'La réponse du service IA est invalide.' }, { status: 502 });
  }
}