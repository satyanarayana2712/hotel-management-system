import { useEffect, useMemo, useRef, useState } from 'react'

import api from '../services/api'

function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState([
    {
      sender: 'ai',
      text: 'Hello, I am your Royal Stay concierge. Ask me about rooms, dining, bookings, or hotel services.'
    }
  ])

  const messagesEndRef = useRef(null)

  const quickPrompts = useMemo(
    () => [
      'Show me the best rooms for a family of 4.',
      'What Indian food is available today?',
      'Help me book a room step by step.',
    ],
    []
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, loading])

  const sendMessage = async (promptText) => {
    const outgoingMessage = (promptText ?? message).trim()
    if (!outgoingMessage || loading) return

    setChat(prev => [...prev, { sender: 'user', text: outgoingMessage }])
    setMessage('')
    setLoading(true)

    try {
      const token = localStorage.getItem('access_token')
      const response = await api.post(
        '/ai/chat/',
        { message: outgoingMessage },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      )

      setChat(prev => [...prev, { sender: 'ai', text: response.data.reply }])
    } catch (error) {
      console.log(error)

      const fallbackMessage =
        error.response?.status === 401
          ? 'Please sign in again to use the concierge chat.'
          : 'Sorry, the AI concierge is temporarily unavailable.'

      setChat(prev => [...prev, { sender: 'ai', text: fallbackMessage }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="chat-launcher"
        aria-label={open ? 'Close concierge chat' : 'Open concierge chat'}
      >
        <span className="chat-launcher__pulse" aria-hidden="true" />
        <span aria-hidden="true">✦</span>
      </button>

      {open && (
        <section className="chat-panel" aria-label="Royal Stay concierge chatbot">
          <header className="chat-panel__header">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/70">
                AI Concierge
              </p>
              <h2 className="text-xl text-white">Royal Stay Assistant</h2>
              <p className="chat-panel__badge">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Hotel help, anytime
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-icon border-white/10 bg-white/10 text-white hover:bg-white/20"
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </header>

          <div className="chat-panel__body">
            <div className="chat-panel__quick-actions">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="floating-chip text-left"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {chat.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className="chat-message" data-side={msg.sender}>
                <div className="chat-message__bubble" data-side={msg.sender}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message" data-side="ai">
                <div className="chat-message__bubble" data-side="ai">
                  <div className="loading-shell text-sm text-[var(--muted)]">
                    <span>Typing</span>
                    <span className="loading-dots" aria-label="Loading">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-panel__input">
            <input
              type="text"
              placeholder="Ask about rooms, food, or bookings..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
              className="input-base"
            />
            <button type="button" onClick={() => sendMessage()} className="btn btn-primary px-4">
              Send
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export default AIChatbot
