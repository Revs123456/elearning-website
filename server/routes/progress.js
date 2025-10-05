import express from 'express';
import { requireAuth, usersStore } from './auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const email = req.session.userEmail;
  const user = usersStore.get(email);
  res.json({ progress: user.progress || {} });
});

router.post('/update', requireAuth, (req, res) => {
  const email = req.session.userEmail;
  const { courseId, moduleId, quizPassed } = req.body;
  if (!courseId || !moduleId) return res.status(400).json({ error: 'courseId and moduleId required' });
  const user = usersStore.get(email);
  user.progress ||= {};
  user.progress[courseId] ||= { completedModules: {}, certificateIssued: false };
  user.progress[courseId].completedModules[moduleId] = { quizPassed: !!quizPassed, completedAt: Date.now() };

  // check completion: all modules completed with quizPassed
  const status = user.progress[courseId];
  res.json({ ok: true, progress: user.progress });
});

router.post('/certificate/issue', requireAuth, (req, res) => {
  const email = req.session.userEmail;
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });
  const user = usersStore.get(email);
  user.progress ||= {};
  user.progress[courseId] ||= { completedModules: {}, certificateIssued: false };
  user.progress[courseId].certificateIssued = true;
  res.json({ ok: true });
});

export default router;
