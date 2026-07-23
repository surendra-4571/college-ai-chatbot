# College AI Chatbot 🤖

A full-stack AI chatbot application for college students, powered by OpenAI and Anthropic Claude.

## Features

- 💬 **Multi-Model Support**: Switch between GPT-4, GPT-3.5-turbo, Claude 3 Opus, and Claude 3 Sonnet
- 💻 **Code Execution**: Execute code in Python, JavaScript, Java, C++, C, and Bash
- 📝 **Chat Sessions**: Save and load conversation history
- 🔐 **Secure**: Rate limiting, input validation, and error handling
- 🎨 **Beautiful UI**: Modern React frontend with responsive design
- ⚡ **Fast**: Node.js Express backend with optimized APIs

## Tech Stack

### Backend
- Node.js with Express
- OpenAI API
- Anthropic Claude API
- Multer for file uploads
- Rate limiting middleware

### Frontend
- React 18
- Vite
- Axios
- React Markdown
- Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- OpenAI API Key
- Anthropic API Key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/surendra-4571/college-ai-chatbot.git
cd college-ai-chatbot
```

2. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your API keys:
```
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Start Backend**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

### Chat API
- `POST /api/chat` - Send message
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/sessions` - List all sessions
- `DELETE /api/chat/session/:sessionId` - Delete session

### Code Execution
- `POST /api/execute` - Execute code
- `GET /api/languages` - Get supported languages

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file
- `GET /api/files` - List files

### Model Configuration
- `GET /api/models` - Get available models
- `POST /api/models/config` - Update model config
- `GET /api/models/config` - Get current config

## Project Structure

```
college-ai-chatbot/
├── backend/
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── codeRoutes.js
│   │   ├── fileRoutes.js
│   │   └── modelRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── InputBox.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── styles/
│   │   │   ├── ChatInterface.css
│   │   │   ├── Message.css
│   │   │   ├── InputBox.css
│   │   │   ├── Sidebar.css
│   │   │   ├── Header.css
│   │   │   └── MessageList.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Usage

1. Open http://localhost:5173 in your browser
2. Type your question or code in the input box
3. Click "Send" to chat or "Execute" to run code
4. Switch between AI models using the dropdown
5. View chat history in the sidebar

## Supported Programming Languages

- Python
- JavaScript/Node.js
- Java
- C++
- C
- Bash/Shell

## Security

- Rate limiting (100 requests per 15 minutes)
- File upload validation
- Code execution timeout (30 seconds)
- CORS protection
- Request body size limits
- Input sanitization

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- React community
- Node.js ecosystem
