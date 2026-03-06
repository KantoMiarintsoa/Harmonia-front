"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, BookOpen, Search, X, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { JournalEntry, JournalTag, JOURNAL_TAGS } from "../types"

interface Props {
  entries: JournalEntry[]
  onAdd: (data: { title: string; content: string; tags: JournalTag[]; date: string }) => void
  onUpdate: (id: string, data: { title: string; content: string; tags: JournalTag[]; date: string }) => void
  onDelete: (id: string) => void
  todayStr: string
}

const ALL_TAGS = Object.keys(JOURNAL_TAGS) as JournalTag[]

const emptyForm = (todayStr: string) => ({ title: "", content: "", tags: [] as JournalTag[], date: todayStr })

export function JournalTracker({ entries, onAdd, onUpdate, onDelete, todayStr }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm(todayStr))
  const [search, setSearch] = useState("")
  const [filterTag, setFilterTag] = useState<JournalTag | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm(todayStr))
    setShowForm(true)
  }

  const openEdit = (entry: JournalEntry) => {
    setEditingId(entry.id)
    setForm({ title: entry.title, content: entry.content, tags: entry.tags, date: entry.date })
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return
    if (editingId) {
      onUpdate(editingId, form)
    } else {
      onAdd(form)
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm(todayStr))
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm(todayStr))
  }

  const toggleTag = (tag: JournalTag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())
    const matchTag = !filterTag || e.tags.includes(filterTag)
    return matchSearch && matchTag
  })

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Journal quotidien</h2>
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {entries.length}
          </span>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400 text-xs font-medium hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
        >
          <Plus className="h-3 w-3" /> Nouvelle entrée
        </button>
      </div>

      {/* Search + tag filter */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full h-8 pl-7 pr-3 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {ALL_TAGS.map(tag => {
            const cfg = JOURNAL_TAGS[tag]
            const active = filterTag === tag
            return (
              <button key={tag} onClick={() => setFilterTag(active ? null : tag)}
                className={`h-8 px-2 rounded-md text-[10px] font-medium whitespace-nowrap transition-all border ${active ? `${cfg.bg} ${cfg.color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>
                {cfg.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {editingId ? "Modifier l'entrée" : "Nouvelle entrée"}
            </span>
            <button onClick={handleCancel} className="h-5 w-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Titre *"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="col-span-2 h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-violet-400"
            />
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          <textarea
            placeholder="Écrivez votre note..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-violet-400 resize-none"
          />

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map(tag => {
                const cfg = JOURNAL_TAGS[tag]
                const selected = form.tags.includes(tag)
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-medium border transition-all ${selected ? `${cfg.bg} ${cfg.color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"}`}>
                    {selected && <Check className="h-2.5 w-2.5" />}
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.content.trim()}
            className="w-full h-8 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors"
          >
            {editingId ? "Enregistrer les modifications" : "Enregistrer"}
          </button>
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map(entry => {
          const expanded = expandedId === entry.id
          return (
            <div key={entry.id}
              className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 p-3 hover:border-violet-200 dark:hover:border-violet-800 transition-all">
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{entry.title}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className={`text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
                    {entry.content}
                  </p>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <button onClick={() => openEdit(entry)}
                    className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => onDelete(entry.id)}
                    className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map(tag => {
                    const cfg = JOURNAL_TAGS[tag]
                    return (
                      <span key={tag} className={`flex items-center gap-1 h-5 px-1.5 rounded-full text-[9px] font-medium ${cfg.bg} ${cfg.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="h-8 w-8 text-gray-200 dark:text-gray-700 mb-2" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {search || filterTag ? "Aucune entrée ne correspond à votre recherche" : "Commencez à écrire votre premier journal"}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
