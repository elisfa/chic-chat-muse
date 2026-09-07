# Chiti Stylist

Build "Chiti" — a personal AI styling app that works like a chat-based styling journal. It's for one user; no multi-tenant accounts needed for now, keep it simple.

CONCEPT: The more you talk to it, the more personalized it gets. Think of it as a stylist friend you text daily — what to wear, what's not working in your closet, quick reactions to an outfit idea — who remembers your taste and gets sharper over time.

THREE VIEWS (tabs or a simple nav):
1. Chat — the main view. A clean chat interface where the user talks to the AI stylist. Show a few tappable "follow-up" suggestion chips under each AI reply so the user can continue the conversation with one tap instead of typing.
2. Journal — a saved list of favorite AI replies/takes the user has starred from the chat, each with a timestamp. Removable.
3. Taste Profile — a simple visual summary of what the AI has learned about the user's taste so far: things she gravitates toward (as pills/tags), things she avoids (as pills/tags in a different, more "warning" color), and a budget lane. This should feel like the payoff screen — proof the app is actually learning her.

AI PERSONALITY: cold, sassy, gen-Z — but never cringe slang, never "bestie," minimal emoji. Confident, decisive opinions, not wishy-washy option lists. A little blunt when an idea is bad. Short replies, not essays.

DESIGN DIRECTION — this is the important part, I want it to feel genuinely beautiful and premium, not like a generic AI chat template:
- Cold, minimal, quiet-luxury aesthetic. Dark mode by default (near-black background, off-white text).
- Monospace typography throughout (JetBrains Mono or similar) — this is core to the brand identity, not incidental.
- Sharp, confident UI: pill-shaped nav/tabs, subtle borders instead of heavy shadows, tight spacing, no rounded-corner-everything softness — a little architectural and cold rather than cute.
- Chat bubbles: user messages solid/inverted (light bubble on dark bg), AI messages outlined/subtle.
- This should feel like a fashion-tech product — closer to a minimal editorial fashion site than a typical SaaS chat app.

For now, wire the chat to a simple mock/placeholder AI response (or a basic LLM call if that's trivial to include) — the priority right now is the visual design and UX polish, not the AI backend, since that part is already built elsewhere. Please make it genuinely gorgeous.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c8e0a095-2653-4fe2-84f2-595410ddccbf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
