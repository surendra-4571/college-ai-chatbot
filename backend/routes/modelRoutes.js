const express = require('express');

const AVAILABLE_MODELS = {
  openai: [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', maxTokens: 8000 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient', maxTokens: 4000 }
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable Claude model', maxTokens: 200000 },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance', maxTokens: 200000 }
  ]
};

let modelConfig = {
  preferred: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000
};

const getAvailableModels = (req, res) => {
  res.json({
    models: AVAILABLE_MODELS,
    currentConfig: modelConfig,
    note: 'Set API keys in .env file to use models'
  });
};

const setModelConfig = (req, res) => {
  try {
    const { preferred, temperature, maxTokens } = req.body;

    if (preferred) {
      const allModels = [...AVAILABLE_MODELS.openai, ...AVAILABLE_MODELS.anthropic];
      if (!allModels.find(m => m.id === preferred)) {
        return res.status(400).json({ error: 'Invalid model ID' });
      }
      modelConfig.preferred = preferred;
    }

    if (temperature !== undefined) {
      if (temperature < 0 || temperature > 2) {
        return res.status(400).json({ error: 'Temperature must be between 0 and 2' });
      }
      modelConfig.temperature = temperature;
    }

    if (maxTokens !== undefined) {
      if (maxTokens < 100 || maxTokens > 200000) {
        return res.status(400).json({ error: 'Max tokens must be between 100 and 200000' });
      }
      modelConfig.maxTokens = maxTokens;
    }

    res.json({
      message: 'Model configuration updated',
      config: modelConfig
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getModelConfig = (req, res) => {
  res.json(modelConfig);
};

module.exports = {
  getAvailableModels,
  setModelConfig,
  getModelConfig
};
