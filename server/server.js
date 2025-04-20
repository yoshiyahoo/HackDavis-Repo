import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// POST /api/generate-quiz
app.post('/api/generate-quiz', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    // Call process_lesson.py to handle the entire pipeline
    const py = spawn('python3', [
      path.join(__dirname, 'process_lesson.py'),
      prompt
    ]);

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => { 
      stdout += data.toString();
      console.log(data.toString());
    });
    
    py.stderr.on('data', (data) => { 
      stderr += data.toString();
      console.error(data.toString());
    });

    const exitCode = await new Promise((resolve) => {
      py.on('close', resolve);
    });

    if (exitCode !== 0) {
      console.error(`process_lesson.py exited with code ${exitCode}`);
      return res.status(500).json({ 
        error: 'Failed to process lesson',
        details: stderr
      });
    }

    // Read quiz.json and send to frontend
    try {
      const quizPath = path.join(__dirname, '../public/quiz.json');
      const quizData = await fs.readFile(quizPath, 'utf8');
      res.json(JSON.parse(quizData));
    } catch (error) {
      // Fallback to root directory if public/quiz.json doesn't exist
      const quizPath = path.join(__dirname, '../quiz.json');
      const quizData = await fs.readFile(quizPath, 'utf8');
      res.json(JSON.parse(quizData));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
