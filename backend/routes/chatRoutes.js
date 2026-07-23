const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Initialize LLM clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory storage (replace with database in production)
const sessions = {};
const messages = {};

const SYSTEM_PROMPT = `You are an expert programming assistant for college students. 
You can help with:
- Java, JavaScript, Python, C, C++, and more programming languages
- Algorithm design and data structures
- Debugging and error fixing
- Writing documentation and comments
- Explaining complex concepts
- System design
- Database design
- Web development
- Project guidance

Always provide:
1. Clear explanations
2. Complete code examples
3. Best practices
4. Edge cases to consider

Be encouraging and support learning!`;

// Send message to chatbot
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId: userSessionId, model = 'gpt-4', language = 'english' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sessionId = userSessionId || uuidv4();
    
    // Initialize session if new
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        id: sessionId,
        createdAt: new Date(),
        updatedAt: new Date(),
        model: model,
        language: language
      };
      messages[sessionId] = [];
    }

    // Add user message to history
    messages[sessionId].push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    let assistantResponse;

    try {
      if (model === 'gpt-4' || model === 'gpt-3.5-turbo') {
        // OpenAI API call
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OpenAI API key not configured');
        }

        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages[sessionId].map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        assistantResponse = response.choices[0].message.content;
      } else if (model === 'claude-3-opus' || model === 'claude-3-sonnet') {
        // Anthropic Claude API call
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error('Anthropic API key not configured');
        }

        const response = await anthropic.messages.create({
          model: model === 'claude-3-opus' ? 'claude-3-opus-20240229' : 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: messages[sessionId].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        });

        assistantResponse = response.content[0].text;
      } else {
        return res.status(400).json({ error: 'Unsupported model' });
      }
    } catch (apiError) {
      console.error('API Error:', apiError.message);
      return res.status(500).json({
        error: `API Error: ${apiError.message}. Please check your API keys in .env file.`,
        hint: 'Make sure you have OPENAI_API_KEY or ANTHROPIC_API_KEY set in .env'
      });
    }

    // Add assistant response to history
    messages[sessionId].push({
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    });

    // Update session timestamp
    sessions[sessionId].updatedAt = new Date();

    res.json({
      sessionId,
      message: assistantResponse,
      model,
      timestamp: new Date(),
      messagesCount: messages[sessionId].length
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get chat history
const getChatHistory = (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!messages[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      messages: messages[sessionId],
      totalMessages: messages[sessionId].length,
      session: sessions[sessionId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions
const getSessions = (req, res) => {
  try {
    const sessionList = Object.values(sessions)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(session => ({
        ...session,
        messageCount: messages[session.id]?.length || 0
      }));

    res.json({
      sessions: sessionList,
      totalSessions: sessionList.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete session
const deleteSession = (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }

    delete sessions[sessionId];
    delete messages[sessionId];

    res.json({ message: 'Session deleted successfully', sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getSessions,
  deleteSession
};
