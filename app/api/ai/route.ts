import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS = {
  prioritize: (tasks: unknown[]) => `
Tu es un assistant de productivité. Analyse ces tâches et retourne une liste priorisée.

Tâches :
${JSON.stringify(tasks, null, 2)}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte, sans texte avant ou après :
{
  "prioritized": [
    {
      "id": "id_de_la_tache",
      "title": "titre",
      "priority": "haute" | "moyenne" | "faible",
      "score": 1-100,
      "reason": "explication courte (max 15 mots)"
    }
  ],
  "summary": "résumé global en 1-2 phrases"
}
`,

  planning: (data: { tasks: unknown[]; mood: number; sleepHours: number; date: string }) => `
Tu es un coach de productivité. Génère un planning quotidien optimal pour aujourd'hui.

Données :
- Date : ${data.date}
- Humeur actuelle : ${data.mood}/5
- Sommeil cette nuit : ${data.sleepHours}h
- Tâches à traiter : ${JSON.stringify(data.tasks, null, 2)}

Retourne UNIQUEMENT un JSON valide :
{
  "energyAdvice": "conseil sur l'énergie du jour (1 phrase)",
  "slots": [
    {
      "time": "09:00 - 10:30",
      "type": "travail" | "pause" | "admin" | "créatif",
      "title": "titre du créneau",
      "taskId": "id si lié à une tâche ou null",
      "tip": "conseil court (max 10 mots)"
    }
  ],
  "dayScore": 1-100
}
`,

  productivity: (data: { moodHistory: unknown[]; sleepHistory: unknown[]; exerciseHistory: unknown[]; tasksCompleted: number; tasksTotal: number }) => `
Tu es un analyste de productivité. Analyse les données de l'utilisateur sur 7 jours.

Données :
- Humeurs : ${JSON.stringify(data.moodHistory)}
- Sommeil : ${JSON.stringify(data.sleepHistory)}
- Exercice : ${JSON.stringify(data.exerciseHistory)}
- Tâches complétées : ${data.tasksCompleted} / ${data.tasksTotal}

Retourne UNIQUEMENT un JSON valide :
{
  "productivityScore": 1-100,
  "insights": [
    {
      "category": "sommeil" | "humeur" | "exercice" | "tâches" | "équilibre",
      "title": "titre (max 8 mots)",
      "detail": "explication (max 25 mots)",
      "impact": "positif" | "négatif" | "neutre",
      "action": "action concrète (max 15 mots)"
    }
  ],
  "topStrength": "point fort principal (1 phrase)",
  "topChallenge": "principal défi (1 phrase)"
}
`,

  burnout: (data: { moodHistory: unknown[]; sleepHistory: unknown[]; exerciseHistory: unknown[]; overdueTasks: number; totalTasks: number; journalEntries: number }) => `
Tu es un expert en bien-être et prévention du burn-out. Analyse ces données et évalue le risque.

Données :
- Humeurs 7j : ${JSON.stringify(data.moodHistory)}
- Sommeil 7j : ${JSON.stringify(data.sleepHistory)}
- Exercice 7j : ${JSON.stringify(data.exerciseHistory)}
- Tâches en retard : ${data.overdueTasks} / ${data.totalTasks}
- Entrées journal : ${data.journalEntries} cette semaine

Retourne UNIQUEMENT un JSON valide :
{
  "riskScore": 0-100,
  "riskLevel": "faible" | "modéré" | "élevé" | "critique",
  "signals": [
    {
      "factor": "nom du facteur",
      "status": "ok" | "attention" | "alerte",
      "detail": "explication courte (max 20 mots)"
    }
  ],
  "recommendations": [
    {
      "priority": "urgente" | "importante" | "conseillée",
      "title": "titre (max 8 mots)",
      "action": "action concrète (max 20 mots)"
    }
  ],
  "message": "message bienveillant personnalisé (2-3 phrases)"
}
`,
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY non configurée dans .env.local" }, { status: 503 })
  }

  try {
    const { type, data } = await req.json()

    let prompt: string
    switch (type) {
      case "prioritize":   prompt = PROMPTS.prioritize(data); break
      case "planning":     prompt = PROMPTS.planning(data);   break
      case "productivity": prompt = PROMPTS.productivity(data); break
      case "burnout":      prompt = PROMPTS.burnout(data);    break
      default: return NextResponse.json({ error: "Type invalide" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Réponse JSON invalide")
    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json({ result })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
