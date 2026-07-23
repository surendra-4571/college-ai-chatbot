# College AI Chatbot 🤖

An advanced AI chatbot powered by modern language models with coding, writing, reasoning, research, automation, file handling, and real-time web capabilities.

## Features ✨

### 🧠 AI Capabilities
- **Multiple LLM Support**: GPT-4, GPT-3.5, Anthropic Claude
- **Code Generation**: Java, JavaScript, Python, C, C++, and more
- **Code Execution**: Run and test code directly
- **Debugging**: Stack trace analysis and error fixing
- **Writing**: Documentation, blogs, essays, resumes
- **Problem Solving**: Algorithms, data structures, system design
- **Real-time Web Search**: Research and current information

### 💻 Development Features
- **Web Interface**: React-based dashboard
- **Desktop App**: Electron for Windows, Mac, Linux
- **Code Editor**: Syntax highlighting and formatting
- **File Management**: Upload, download, and browse files
- **Conversation History**: Save and load chat sessions
- **Project Management**: Organize multiple projects
- **API Integration**: RESTful backend with Express.js

### 📚 Programming Languages Supported
- Java
- JavaScript / TypeScript
- Python
- C
- C++
- And many more!

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **APIs**: OpenAI, Anthropic Claude
- **Code Execution**: Sandbox environment
- **Database**: JSON-based (can upgrade to MongoDB/PostgreSQL)

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor (VS Code editor)
- **State Management**: Context API / Redux
- **Build Tool**: Vite

### Desktop
- **Framework**: Electron
- **Package**: electron-builder

## Project Structure

```
college-ai-chatbot/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── config/             # Configuration files
│   └── package.json
│
├── frontend/               # React web app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API calls
│   │   └── App.jsx
│   └── package.json
│
├── desktop/               # Electron desktop app
│   ├── main.js           # Electron main process
│   ├── preload.js        # IPC communication
│   └── package.json
│
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher) - Download from https://nodejs.org/
- **npm** or **yarn** package manager
- **API Keys** (optional):
  - OpenAI API Key: https://platform.openai.com/api-keys
  - Anthropic Claude API Key: https://www.anthropic.com/

### Step 1: Clone the Repository
```bash
git clone https://github.com/surendra-4571/college-ai-chatbot.git
cd college-ai-chatbot
```

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys (optional)
npm start
# Backend runs on http://localhost:5000
```

### Step 3: Setup Frontend (Web)
```bash
cd ../frontend
npm install
npm run dev
# Web app opens at http://localhost:5173
```

### Step 4: Setup Desktop App (Optional)
```bash
cd ../desktop
npm install
npm start
# Electron app launches
```

## API Endpoints

### Chat Endpoints
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat/history/:sessionId` - Get chat history
- `DELETE /api/chat/session/:sessionId` - Delete session

### Code Execution
- `POST /api/execute` - Execute code
- `GET /api/languages` - Get supported languages

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file

### LLM Configuration
- `GET /api/models` - Get available models
- `POST /api/models/config` - Set default model

## Usage Examples

### Web Version
1. Open http://localhost:5173
2. Type your coding question in the chat box
3. Select preferred LLM (GPT-4, GPT-3.5, Claude)
4. Get instant answers with code examples
5. Execute code directly in the interface

### Desktop Version
1. Launch the Electron app
2. Same features as web version
3. Offline capability (if configured)
4. Native Windows/Mac/Linux experience

### Example Prompts
```
"Write a Java program to sort an array using quicksort"
"Debug this Python code: [paste code]"
"Explain how binary search works with example"
"Create a REST API in Node.js"
"Help me with a college project in C++"
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4

# Anthropic Claude
ANTHROPIC_API_KEY=your_claude_key_here

# Code Execution
ENABLE_CODE_EXECUTION=true
CODE_TIMEOUT=30000
SANDBOX_ENABLED=true

# Database (optional)
DATABASE_URL=mongodb://localhost:27017/chatbot

# Session
SESSION_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## Features in Detail

### 1. Code Execution 🚀
- Execute Python, JavaScript, Java, C, C++ code
- Real-time output and error handling
- Timeout protection (30 seconds default)
- Sandbox environment for security

### 2. Multiple LLMs 🧠
- Switch between OpenAI GPT-4/3.5
- Anthropic Claude for specific tasks
- Custom system prompts per model
- Token usage tracking

### 3. File Management 📁
- Upload code files
- Download generated code
- Project file organization
- Version history (optional)

### 4. Chat Features 💬
- Persistent conversation history
- Search through old conversations
- Export chat as markdown/PDF
- Share chat links (optional)

### 5. Code Editor 🎨
- Syntax highlighting for multiple languages
- Real-time formatting
- Theme support (light/dark)
- Keyboard shortcuts

## Customization

### Add Your Own System Prompt
Edit `backend/config/prompts.js`:

```javascript
const SYSTEM_PROMPTS = {
  coding: "You are an expert programmer...",
  writing: "You are a professional writer...",
  tutoring: "You are an experienced college tutor..."
};
```

### Add More Languages
Edit `backend/config/languages.js`:

```javascript
const LANGUAGES = {
  python: { ext: '.py', executor: 'python3' },
  java: { ext: '.java', executor: 'javac && java' },
  // Add more...
};
```

### Change UI Theme
Edit `frontend/src/App.jsx`:

```javascript
const THEME = {
  primary: '#3B82F6',
  secondary: '#1F2937',
  // Customize colors
};
```

## Deployment

### Deploy Backend (Render, Railway, Heroku)
```bash
cd backend
npm run build
# Follow platform-specific deployment steps
```

### Deploy Frontend (Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Build Desktop App for Distribution
```bash
cd desktop
npm run build
# Creates installers for Windows, Mac, Linux
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Or kill the process and restart
```

### API key errors
```bash
# Verify .env file is in backend directory
# Make sure API keys are valid and have credits
```

### Frontend can't connect to backend
```bash
# Check CORS settings in backend
# Ensure backend is running on http://localhost:5000
```

## Contributing

To improve this chatbot:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Future Enhancements 🚧

- [ ] Voice input/output
- [ ] Image processing capabilities
- [ ] Database integration (MongoDB)
- [ ] Real-time collaboration
- [ ] Custom model fine-tuning
- [ ] Plugin system
- [ ] Mobile app (React Native)
- [ ] Advanced code analytics

## License

This project is open source and available under the MIT License.

## Support & Contact

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Ask questions on GitHub Discussions
- **Email**: Contact your college support team

## Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Electron Documentation](https://www.electronjs.org/docs)

---

**Built for college students by a developer. Happy coding! 🎓**
