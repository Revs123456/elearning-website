import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load courses from JSON - try new file first, fallback to old
const newCoursesPath = path.resolve(__dirname, '..', 'data', 'frustrated-thinkers-courses.json');
const oldCoursesPath = path.resolve(__dirname, '..', 'data', 'courses.json');
let coursesPath = fs.existsSync(newCoursesPath) ? newCoursesPath : oldCoursesPath;
let coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));

router.get('/', (req, res) => {
  // Return course list (without full module content)
  const courseList = coursesData.map(c => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    image: c.image,
    moduleCount: c.modules.length
  }));
  res.json(courseList);
});

router.get('/:id', (req, res) => {
  const course = coursesData.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

router.get('/:courseId/modules/:moduleId', (req, res) => {
  const course = coursesData.find(c => c.id === req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const mod = course.modules.find(m => m.id === req.params.moduleId);
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  res.json(mod);
});

export default router;
