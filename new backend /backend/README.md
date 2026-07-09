# Company RAG Chatbot — Backend

A simple Node.js backend for a company knowledge chatbot. It serves a health-check endpoint, a placeholder chat route, and tools to read PDF and EML documents from the local `documents/` folder.

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the server with auto-reload on file changes:

```bash
npm run dev
```

The server runs on [http://localhost:3000](http://localhost:3000).

## Read Documents

Place PDF or EML files in the `documents/` folder, then run:

```bash
npm run read-documents
```

This prints each supported file and how many characters were extracted from it.

## Production

Start the server without nodemon:

```bash
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description        |
| -------- | ------- | ------------------ |
| `PORT`   | `3000`  | Server port number |
