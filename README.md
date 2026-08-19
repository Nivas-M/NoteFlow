# NoteFlow

NoteFlow is a full-stack note-taking application built with React, Node.js, Express, MongoDB Atlas, and Google Gemini AI. It provides cloud-synced note management, fuzzy search capabilities, and integrated artificial intelligence tools.

---

## Features

### Note Management
* Create, read, update, and delete notes.
* Persistent cloud storage powered by MongoDB Atlas.
* Real-time metadata tracking, including word count, line count, and relative timestamps.

### Search Engine
* Server-side fuzzy matching utilizing the Levenshtein distance algorithm.
* Typo-tolerant querying across note titles and content.

### AI Capabilities
* **Summarize**: Generate concise summaries of note text.
* **Fix Grammar**: Correct spelling, grammar, and punctuation.
* **Expand Draft**: Elaborate on rough ideas and short notes.
* **Extract Actions**: Convert note content into bulleted to-do items.
* **Make Formal**: Rewrite notes into professional business language.
* **Multi-Language Translation**: Translate note text into target languages (Spanish, French, German, Japanese, Hindi, Chinese).
* **Note Q&A**: Interactively query note contents for specific information.

---

## Tech Stack

* **Frontend**: React, Vite, Custom CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas (Mongoose ORM)
* **AI Integration**: Google Gemini API (`@google/generative-ai`)

---

## Environment Setup

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Getting Started

### 1. Install Dependencies

In the `backend` folder:
```bash
cd backend
npm install
```

In the `frontend` folder:
```bash
cd frontend
npm install
```

### 2. Run Development Servers

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend application:
```bash
cd frontend
npm run dev
```

Access the web interface at `http://localhost:5173`.
