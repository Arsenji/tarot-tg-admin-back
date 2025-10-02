import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const messageController = new MessageController();

// Публичный endpoint для приема сообщений от пользователей
router.post('/', (req, res) => messageController.createMessage(req, res));

// Все остальные роуты требуют аутентификации
router.use(authenticateToken);
router.use(requireAdmin);

// GET /messages - получить все сообщения с фильтрацией
router.get('/', (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'Database not configured' });
  }
  messageController.getMessages(req, res);
});

// GET /messages/:id - получить сообщение по ID
router.get('/:id', (req, res) => messageController.getMessageById(req, res));

// PUT /messages/:id/status - обновить статус сообщения
router.put('/:id/status', (req, res) => messageController.updateMessageStatus(req, res));

// POST /messages/:id/reply - ответить на сообщение
router.post('/:id/reply', (req, res) => messageController.replyToMessage(req, res));

// DELETE /messages/:id - удалить сообщение
router.delete('/:id', (req, res) => messageController.deleteMessage(req, res));

export default router;
