# Roxie – Project Context & Architecture

## 1. What Roxie Is

Roxie is a **personal, voice-first AI assistant and digital second brain** built exclusively for Rahul (single-user by default; multi-user support is a future goal).

Her primary job is to **offload Rahul's memory, planning, and mental overhead** so he can stay mentally "empty" without losing control of his life. She behaves like a human personal assistant who listens, remembers everything, and helps act at the right time — without requiring discipline, structure, or effort from the user.

**One-line definition:**

> Roxie is Rahul's private, always-on personal assistant whose primary job is to remember everything Rahul doesn't want to, understand his vague human intent, and help him act at the right time without requiring effort, structure, or discipline from him.

---

## 2. Core Philosophy

1. **Rahul is lazy by design** – Roxie adapts to him, not the other way around. He will not journal, organize, or maintain lists manually.
2. **Memory offloading is the primary function** – Rahul should never strain to remember what he said, planned, owes, or needs to do. If Roxie fails here, Roxie fails entirely.
3. **Natural language always comes first** – Rahul speaks casually and vaguely. Roxie must infer intent from normal human language, never requiring commands, formats, or categories from the user.
4. **Privacy-first, trust-based** – Roxie is trusted with everything: money, plans, people, mistakes, half-ideas. She must behave conservatively, avoid hallucination, and ask for clarification only when genuinely necessary.
5. **Reactive, not autonomous** – Roxie acts only on explicit commands or confirmations, except for proactive task reminders.
6. **Memory as identity** – Every confirmed memory contributes to Roxie's knowledge base, creating continuity and personalized context over time.

---

## 3. Functional Goals

- **Semantic memory storage and retrieval** – Natural-language queries only; aggregated, context-aware responses.
- **Multi-intent parsing** – A single message like "Buy milk, borrow shirt from Akshay for tomorrow, and get shoes from Zudio" must be split into separate, independently stored intentions.
- **Task and reminder management** – Store, retrieve, update content, due dates, and priorities.
- **Proactive alerts** – Push notifications or voice reminders for tasks based on priority and due dates.
- **Editable memories/tasks** – Content, due dates, and priority levels can be modified with user confirmation.
- **Vague query handling** – Must handle queries like "What am I forgetting?", "Anything pending?", "Did I say anything about clothes?"
- **Optional chat mode** – For private or noisy environments; default remains voice-first.

---

## 4. What Roxie Is Not

- Not a rigid task manager
- Not a form-filling app
- Not a command-based assistant
- Not a productivity guru
- Not trying to be "smart" at the cost of being wrong
- Not optimized for multiple users (yet)

---

## 5. Technical Stack

| Layer                | Technology                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Frontend**         | React Native (Android-first; web chat exists at `../roxie-web-chat`)                                               |
| **Backend**          | Node.js + Express + TypeScript (ESM)                                                                               |
| **AI Orchestration** | LangChain + LangGraph (`createReactAgent`)                                                                         |
| **LLM**              | Currently an online LLM API; future plan is to migrate to a locally hosted open-source model running on the server |
| **Embedding Model**  | Currently `BAAI/bge-large-en-v1.5`; to be replaced with a local model (e.g. `Xenova/all-MiniLM-L6-v2`)             |
| **Database**         | PostgreSQL + pgvector                                                                                              |
| **Voice STT**        | Whisper (local)                                                                                                    |
| **Voice TTS**        | WhisperSpeech or Piper TTS (local)                                                                                 |

---

## 6. Backend Architecture

### 6.1 Runtime Entry

- **File**: `src/app.ts`
- Starts Express server
- Exposes `POST /api/ask` (primary endpoint)
- Uses `createReactAgent` with the configured online LLM
- Loads tools from `src/tools/index.ts`
- Uses `MemorySaver` checkpointing with `thread_id` for short-term conversation context

### 6.2 Database

- **File**: `src/db/index.ts`
- Initializes `pg` pool from `POSTGRES_URL`
- Runs `CREATE EXTENSION IF NOT EXISTS vector` on startup

### 6.3 Backend Flow

```
User Input (voice or text)
        ↓
[STT – Whisper if voice]
        ↓
[Express API – POST /api/ask]
        ↓
[LangGraph Agent]
        ↓
[Intent extraction + multi-item parsing]
        ↓
[Category matching via embedding similarity against categories table]
        ↓
    ┌───────────────────────────────────┐
    │  Match ≥ threshold?               │
    │  YES → use existing category      │
    │  NO  → LLM names new category,    │
    │         store with embedding      │
    └───────────────────────────────────┘
        ↓
[Store to data_store table (JSONB + vector embedding)]
        ↓
[Generate response]
        ↓
[TTS – Piper/WhisperSpeech if voice]
        ↓
User Output
```

### 6.4 Query / Retrieval Flow

```
User query (vague or specific)
        ↓
[Embed query on-the-fly]
        ↓
[LLM determines which categories are relevant]
        ↓
[Retrieve from data_store by category + optional semantic similarity]
        ↓
[Aggregate + rank results]
        ↓
[Context-aware natural language response]
```

---

## 7. Data Architecture

### 7.1 Core Tables

```sql
-- Tracks all known categories dynamically
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  embedding vector(1024),      -- embedding of the category name
  created_at TIMESTAMP DEFAULT NOW(),
  usage_count INT DEFAULT 0
);

-- All stored data lives here regardless of domain
CREATE TABLE data_store (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  data JSONB NOT NULL,         -- flexible, schema-less per category
  embedding vector(1024),      -- embedding of the stored content
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversation messages for short and long-term memory
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,          -- 'user' | 'assistant'
  content TEXT NOT NULL,
  embedding vector(1024),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_category_embedding ON categories USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_data_embedding ON data_store USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_data_category ON data_store(category_id);
CREATE INDEX idx_messages_embedding ON messages USING ivfflat (embedding vector_cosine_ops);
```

### 7.2 Category System

Categories are **dynamic, self-organizing, and embedding-driven**. The LLM does not freely invent category names. Instead:

1. On every incoming intent, the backend fetches all existing categories with their stored embeddings.
2. Cosine similarity is computed between the intent embedding and each category embedding **in application code** (not by the LLM).
3. If the best match score is **≥ threshold (default 0.75)**, the existing category is used.
4. If below threshold, the LLM is asked to name a new category (given the list of existing ones to avoid near-duplicates), and it is stored with its embedding.
5. Category usage count is incremented on every match to track activity.

**Seeded categories (added at bootstrap):**

```
groceries, shopping_clothes, shopping_electronics, shopping_other,
tasks, work_tasks, borrowed_items, money_owed_to_me, money_i_owe,
health_tracking, calendar_events, personal_notes, books_media, contacts
```

**Threshold tuning:**

- Start at `0.75`
- Monitor false positives (wrong match) and false negatives (unnecessary new category)
- Tune based on real usage; do not go below `0.70`

### 7.3 Memory Strategy

| Layer               | Mechanism                                                                              |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Short-term**      | Last 20 messages passed in LLM context                                                 |
| **Long-term**       | All messages stored in `messages` table with embeddings; retrieved via semantic search |
| **Structured data** | Stored in `data_store` with category, JSONB data, and embedding                        |

Embeddings are generated **only after user confirmation** for memory storage. Query embeddings are generated **on-the-fly**.

---

## 8. Personality & System Prompt

Roxie's system prompt establishes her as a **close, emotionally intelligent personal assistant** to Rahul. Key characteristics defined in the prompt:

- Speaks casually and warmly, not like a formal assistant
- Never lectures, moralizes, or adds unsolicited advice
- Admits when she doesn't know something rather than guessing
- Asks clarifying questions only when genuinely necessary (money, deadlines, commitments)
- Proactively surfaces relevant memories or reminders when contextually appropriate
- Keeps responses concise unless detail is explicitly needed
- Treats all information shared by Rahul as private and sensitive

---

## 9. Tooling

### 8.1 Current Registered Tools

- `getCurrentDateTime` (`src/tools/getCurrentDateTime.ts`)

### 8.2 Tool Architecture Philosophy

Roxie does **not** use one tool per action or per data domain. Instead, tools map to **generic data operations**:

| Tool                   | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `store_data`           | Save any structured intent to `data_store` after category resolution |
| `retrieve_data`        | Query `data_store` by category and/or filters                        |
| `update_data`          | Modify existing entries in `data_store`                              |
| `search_data`          | Semantic similarity search across `data_store` or `messages`         |
| `set_reminder`         | Schedule a push notification or voice alert                          |
| `get_current_datetime` | Utility: current date and time                                       |

Previous MongoDB-backed user and grocery tools were removed during DB migration and are **not to be reimplemented as domain-specific tools**.

---

## 9. Interaction & UX

- **Voice-first**: Default interaction is voice input and output.
- **Chat mode**: Optional fallback for private or public environments.
- **Confirmation UI**: Screen modals or voice prompts for edits, memory storage, or task updates.
- **Aggregated responses**: Multiple relevant memories or tasks summarized in a single coherent response.
- **Non-intrusive suggestions**: Roxie may propose links between items but never acts without explicit approval.
- **Minimal interruption**: Roxie only asks for clarification when acting incorrectly would cause real harm or when a decision must be locked in (money, deadlines, commitments).

---

## 10. Memory & Task Behaviour

- **Memory creation**: Opt-in; confirmation required before embedding is generated and stored.
- **Multi-intent messages**: Each intention in a single message is extracted, categorized, and stored independently.
- **Priority system**: High, medium, low; influences retrieval ranking and reminder scheduling.
- **Reminder scheduling**:
  - Explicit due date → exact reminder
  - No due date or vague time → default low-priority reminder in 4–8 hours (user confirmation required)
- **Trust and failure handling**: If Roxie is unsure, she admits uncertainty, offers a conservative answer, and asks for confirmation. She never confidently fabricates information.

---

## 11. Source Structure

```
src/
├── app.ts                          # Express server entry, agent setup, /api/ask endpoint
├── db/
│   ├── index.ts                    # PostgreSQL pool init, pgvector extension bootstrap
│   ├── schema.ts                   # Table creation (categories, data_store, messages) + indexes
│   └── seed.ts                     # Default category seeding with embeddings
├── helpers/
│   ├── config.ts                   # Environment config, constants, system prompt
│   ├── get-embeddings.ts           # Embedding generation utility (calls roxie-embedder)
│   └── utils.ts                    # General utility functions
├── integrations/
│   └── tavily/                     # Tavily search integration (placeholder)
└── tools/
    ├── getCurrentDateTime.ts       # Tool: returns current date and time
    └── index.ts                    # Tool registry, exports all tools to agent
```

---

## 12. Scripts & Dev Notes

```bash
pnpm start       # tsx watch src/app.ts
pnpm build       # tsc
pnpm lint
pnpm format
```

> ⚠️ **IMPORTANT: This project uses `pnpm` exclusively as its package manager.**
> Never use `npm` or `yarn` to install dependencies or run scripts.
> Always use `pnpm install`, `pnpm add`, `pnpm remove`, etc.
> Using `npm` or `yarn` will create conflicting lockfiles and break the project.

- Environment variables are defined in `roxie-brain/.env`. Refer to that file for all required keys.
- Ignore Sibling projects in the folder unless specifically asked for
- If modules are missing locally, run `pnpm install` before proceeding.

---

## 13. Project Roadmap

> **Maintenance rule:** Remove tasks from this list as they are completed. This file should always reflect only what remains to be done.

### Phase 2: Memory & Conversation Persistence

- [ ] **Message persistence** — Store every conversation message (user + assistant) in the `messages` table with embeddings. Currently messages only live in LangGraph's in-memory `MemorySaver`.
- [ ] **Persistent conversation checkpointing** — Replace `MemorySaver` with `PostgresSaver` (or equivalent) so conversation history survives server restarts.
- [ ] **Long-term memory retrieval** — When the LLM needs context beyond the current conversation window, semantic-search the `messages` table and inject relevant past messages into context.
- [ ] **Short-term memory window** — Enforce a sliding window of last ~20 messages in LLM context to keep token usage manageable while maintaining conversational coherence.
- [ ] **Memory confirmation flow** — Before storing a memory/data point, Roxie confirms with the user. Embeddings are generated only *after* confirmation, not speculatively.

### Phase 3: Multi-Intent Parsing

- [ ] **Multi-intent extraction** — Parse a single user message like "Buy milk, borrow shirt from Akshay for tomorrow, and get shoes from Zudio" into 3 separate intents, each independently categorized and stored.
- [ ] **Context preservation across intents** — When splitting intents, preserve contextual information (e.g., "from Akshay" applies to the shirt, not the milk).
- [ ] **Batch confirmation UX** — After parsing multiple intents, present all of them to the user for confirmation in a single response rather than one-by-one.

### Phase 4: Reminder & Task System

- [ ] **`set_reminder` tool** — Schedule a reminder with a message, due date/time, and priority level. Store in database with scheduling metadata.
- [ ] **Reminder scheduler service** — Background process (cron or interval-based) that checks for due reminders and triggers notifications.
- [ ] **Push notification delivery** — Send reminder notifications to the user (web push for web chat, FCM for future mobile app).
- [ ] **Smart reminder defaults** — When no explicit due date is given, default to a low-priority reminder in 4–8 hours (with user confirmation).
- [ ] **Priority-based scheduling** — High-priority items get more aggressive reminder timing; low-priority items are gentler.
- [ ] **Due date extraction** — Parse natural language time references ("tomorrow", "next Monday", "in 2 hours", "end of month") into concrete timestamps.
- [ ] **Recurring tasks** — Support repeating reminders (daily, weekly, monthly, custom intervals).

### Phase 5: Web Chat Frontend Improvements

- [ ] **Confirmation UI modals** — When Roxie asks for confirmation (memory storage, edits, multi-intent), show a structured modal/card instead of plain text.
- [ ] **Session persistence** — Currently the web chat loses all messages on page refresh. Persist conversation history (either client-side or server-side via thread ID).
- [ ] **Typing/thinking indicator** — Show a more polished indicator while Roxie is processing (currently just a spinner).
- [ ] **Error handling UI** — Display user-friendly error states when the backend is unreachable or returns errors.
- [ ] **Message timestamps** — Show when each message was sent/received.
- [ ] **Chat history sidebar** — Allow browsing and resuming previous conversation threads.

### Phase 6: Voice Pipeline

- [ ] **Whisper STT integration** — Local speech-to-text using Whisper. Accept audio input from the frontend, transcribe, and feed to the LLM as text.
- [ ] **Piper TTS / WhisperSpeech integration** — Local text-to-speech. Convert Roxie's text responses to audio and stream back to the frontend.
- [ ] **Voice input endpoint** — New API endpoint (or WebSocket) that accepts audio streams/files and returns text + audio responses.
- [ ] **Voice activity detection (VAD)** — Detect when the user starts/stops speaking for hands-free interaction.
- [ ] **Enhanced personality layer for voice** — Tune TTS parameters (speed, tone, pauses) to match Roxie's casual personality.

### Phase 7: Infrastructure & DevOps

- [ ] **Docker Compose for full stack** — Single `docker-compose.yml` to spin up roxie-brain, roxie-embedder, and PostgreSQL together.
- [ ] **API authentication** — Add basic auth or API key validation to `/api/ask` to prevent unauthorized access.
- [ ] **Environment-based configuration** — Separate dev/prod configs, with sensible defaults and validation on startup.
- [ ] **Health check endpoints** — `/health` on both brain and embedder services for monitoring and Docker health checks.
- [ ] **Request logging & observability** — Structured logging for requests, tool calls, and errors. LangSmith tracing is already configured but could be extended.

### Phase 8: LLM & Embedding Improvements

- [ ] **Migrate to local LLM** — Replace OpenRouter API with a locally hosted model via Ollama (e.g., Llama 3 8B, Mistral 7B, or similar). Eliminates API dependency and cost.
- [ ] **Migrate embeddings to local model** — Replace `BAAI/bge-large-en-v1.5` with a lighter local model (e.g., `Xenova/all-MiniLM-L6-v2`). Would require re-embedding all stored data and adjusting vector dimensions.
- [ ] **LLM response quality tuning** — Evaluate and tune temperature, system prompt, and model choice for Roxie's specific use case (memory assistant vs. general chat).
- [ ] **Fallback LLM strategy** — If the primary LLM is unavailable, gracefully degrade (queue the request, use a backup model, or inform the user).

### Phase 9: Integrations

- [ ] **Tavily web search tool** — Connect the already-configured Tavily API key to give Roxie the ability to search the web when her own memory doesn't have the answer.
- [ ] **Calendar integration** — Sync with Google Calendar or similar for event-aware reminders and scheduling.
- [ ] **Expense tracking integration** — Optional: connect with a simple expense tracker for money-related memories (money owed, spent, etc.).

### Phase 10: React Native Mobile App

- [ ] **React Native project setup** — Initialize the Android-first mobile app (the primary intended frontend).
- [ ] **Voice-first interaction design** — Primary UI is a voice interface, with text chat as fallback.
- [ ] **Push notification handling** — Receive and display reminder notifications via FCM.
- [ ] **Offline mode** — Queue messages when offline, sync when back online.
- [ ] **Background voice listener** — Optional always-on listening mode with wake word detection.

### Phase 11: Advanced Features (Long-term)

- [ ] **Memory visualization (mind graph)** — Visual graph of stored memories, categories, and connections in the frontend.
- [ ] **Memory aggregation & summarization** — Periodically summarize old memories into higher-level summaries to reduce storage and improve retrieval.
- [ ] **Category deduplication tooling** — Periodic process to merge semantically similar categories that have drifted apart.
- [ ] **Multi-user support** — Per-user category namespacing, authentication, and data isolation.
- [ ] **Smart context injection** — Proactively surface relevant memories during conversation without being asked (e.g., "By the way, you mentioned X last week").
- [ ] **Conversation summarization** — At the end of long conversations, generate a summary and store as a memory for future reference.
