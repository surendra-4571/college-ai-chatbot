const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execPromise = promisify(exec);

const SUPPORTED_LANGUAGES = {
  python: {
    name: 'Python',
    ext: '.py',
    executor: 'python3',
    installed: true
  },
  javascript: {
    name: 'JavaScript',
    ext: '.js',
    executor: 'node',
    installed: true
  },
  java: {
    name: 'Java',
    ext: '.java',
    executor: 'java',
    installed: false,
    note: 'Requires JDK installed'
  },
  cpp: {
    name: 'C++',
    ext: '.cpp',
    executor: 'g++',
    installed: false,
    note: 'Requires GCC installed'
  },
  c: {
    name: 'C',
    ext: '.c',
    executor: 'gcc',
    installed: false,
    note: 'Requires GCC installed'
  },
  bash: {
    name: 'Bash',
    ext: '.sh',
    executor: 'bash',
    installed: true
  }
};

const CODE_TIMEOUT = parseInt(process.env.CODE_TIMEOUT) || 30000; // 30 seconds
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Execute code
const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!language || !SUPPORTED_LANGUAGES[language]) {
      return res.status(400).json({
        error: `Unsupported language. Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`
      });
    }

    const langConfig = SUPPORTED_LANGUAGES[language];
    const filename = `code_${Date.now()}${langConfig.ext}`;
    const filepath = path.join(TEMP_DIR, filename);

    // Write code to file
    fs.writeFileSync(filepath, code);

    let command;
    let compiledFile = filepath;

    try {
      // Execute based on language
      switch (language) {
        case 'python':
          command = `${langConfig.executor} "${filepath}"`;
          break;
        case 'javascript':
          command = `${langConfig.executor} "${filepath}"`;
          break;
        case 'java':
          command = `cd ${TEMP_DIR} && javac ${filename} && java ${filename.replace('.java', '')}`;
          compiledFile = path.join(TEMP_DIR, filename.replace('.java', '.class'));
          break;
        case 'cpp':
          const cppOutput = filepath.replace('.cpp', '');
          command = `${langConfig.executor} "${filepath}" -o "${cppOutput}" && "${cppOutput}"`;
          compiledFile = cppOutput;
          break;
        case 'c':
          const cOutput = filepath.replace('.c', '');
          command = `${langConfig.executor} "${filepath}" -o "${cOutput}" && "${cOutput}"`;
          compiledFile = cOutput;
          break;
        case 'bash':
          command = `${langConfig.executor} "${filepath}"`;
          break;
        default:
          command = `${langConfig.executor} "${filepath}"`;
      }

      // Execute with timeout
      const { stdout, stderr } = await execPromise(command, {
        timeout: CODE_TIMEOUT,
        maxBuffer: 1024 * 1024 * 10 // 10MB
      });

      // Clean up temp files
      setTimeout(() => {
        try {
          fs.unlinkSync(filepath);
          if (compiledFile !== filepath && fs.existsSync(compiledFile)) {
            fs.unlinkSync(compiledFile);
          }
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }, 1000);

      res.json({
        success: true,
        language,
        output: stdout,
        errors: stderr || null,
        executionTime: `~${CODE_TIMEOUT / 1000}s`,
        timestamp: new Date()
      });
    } catch (execError) {
      // Clean up on error
      try {
        fs.unlinkSync(filepath);
      } catch (e) {}

      res.status(400).json({
        success: false,
        language,
        error: execError.message,
        stderr: execError.stderr || 'No error output',
        stdout: execError.stdout || 'No standard output'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get supported languages
const getSupportedLanguages = (req, res) => {
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => ({
    id: key,
    ...value
  }));

  res.json({
    languages,
    total: languages.length,
    note: 'Some languages require additional tools to be installed on the system'
  });
};

module.exports = {
  executeCode,
  getSupportedLanguages
};
