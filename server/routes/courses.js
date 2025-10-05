import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '..', 'data', 'courses.json');
const enhancedPath = path.resolve(__dirname, '..', 'data', 'courses-enhanced.json');

const router = express.Router();

function loadCourses() {
  const text = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(text);
}

function loadEnhancedCourses() {
  try {
    const text = fs.readFileSync(enhancedPath, 'utf-8');
    return JSON.parse(text);
  } catch {
    return [];
  }
}

router.get('/list', (req, res) => {
  const courses = loadCourses().map(({ modules, ...c }) => c);
  res.json({ courses });
});

router.get('/:id/modules', (req, res) => {
  const { id } = req.params;
  
  // Check enhanced courses first (for DevOps with code examples)
  const enhancedCourses = loadEnhancedCourses();
  let course = enhancedCourses.find(c => c.id === id);
  
  // Fall back to regular courses
  if (!course) {
    const regularCourses = loadCourses();
    course = regularCourses.find(c => c.id === id);
  }
  
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ modules: course.modules });
});

export default router;
