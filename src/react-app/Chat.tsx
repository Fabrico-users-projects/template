import { useState, useEffect, useRef, useCallback, FormEvent } from 'react'

interface Message {
  author: string
  text: string
  timestamp: number
}

const NAMESPACE = 'chat'

function randomUsername() {
  const adjectives = ['swift', 'calm', 'bold', 'wise', 'kind']
  const nouns = ['fox', 'owl', 'bear', 'wolf', 'hawk']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 100)
  return `${adj}-${noun}-${num}`
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [username] = useState(randomUsername)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/api/chat/ws?namespace=${NAMESPACE}`,
    )
    wsRef.current = ws

    ws.onopen = () => setStatus('connected')
    ws.onclose = () => setStatus('disconnected')
    ws.onerror = () => setStatus('disconnected')

    ws.onmessage = (e) => {
      try {
        const { event, data } = JSON.parse(e.data as string)
        if (event === 'message') {
          setMessages((prev) => [...prev, data as Message])
        }
      } catch {}
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const text = input.trim()
      if (!text || status !== 'connected') return
      setInput('')
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namespace: NAMESPACE, author: username, text }),
      })
    },
    [input, username, status],
  )

  const statusColor =
    status === 'connected'
      ? 'bg-green-500'
      : status === 'connecting'
        ? 'bg-yellow-500'
        : 'bg-red-500'

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className="font-semibold text-sm">#{NAMESPACE}</span>
        <span className="text-xs text-muted-foreground ml-auto">you are {username}</span>
      </header>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-16">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.author === username
          return (
            <div key={i} className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-muted-foreground px-1">{msg.author}</span>
              <div
                className={`max-w-xs sm:max-w-md px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="flex items-center gap-2 px-4 py-3 border-t border-border shrink-0"
      >
        <input
          className="flex-1 bg-input text-foreground placeholder:text-muted-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring border border-border"
          placeholder={status === 'connected' ? 'Type a message…' : 'Connecting…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'connected'}
        />
        <button
          type="submit"
          disabled={!input.trim() || status !== 'connected'}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
    </div>
  )
}
