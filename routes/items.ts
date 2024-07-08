import express, { Request, Response } from 'express';
import db from '../database';
const router = express.Router();

/**
 * @swagger
 * /items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Retrieve all items
 *     description: Returns a list of all items in the database.
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id_Item:
 *                     type: integer
 *                     description: The ID of the item.
 *                   nom:
 *                     type: string
 *                     description: The name of the item.
 *                   image:
 *                     type: string
 *                     description: The URL of the item's image.
 *       500:
 *         description: Server error
 */
router.get('/items', (req: Request, res: Response) => {
    db.query('SELECT * FROM Items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /ajouterItem:
 *   post:
 *     tags:
 *       - Items
 *     summary: Add a new item
 *     description: Adds a new item to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - image
 *             properties:
 *               nom:
 *                 type: string
 *                 description: The name of the item.
 *               image:
 *                 type: string
 *                 description: The URL of the item's image.
 *     responses:
 *       200:
 *         description: New item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nouvel item ajouté avec succès: {nom}"
 *       500:
 *         description: Server error
 */
router.post('/ajouterItem', (req: Request, res: Response) => {
    const { nom, image } = req.body;
    db.query('INSERT INTO Items (nom, image) VALUES (?, ?)', [nom, image], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Nouvel item ajouté avec succès: ${nom}` });
    });
});

/**
 * @swagger
 * /update-items-status:
 *   post:
 *     tags:
 *       - Items
 *     summary: Update the status of items
 *     description: Update the active status of multiple items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the item.
 *                 active:
 *                   type: boolean
 *                   description: The new active status of the item.
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Status updated successfully"
 *       500:
 *         description: Server error
 */
router.post('/update-items-status', (req: Request, res: Response) => {
    const updates: { id: number; active: boolean }[] = req.body;
  
    updates.forEach(update => {
      db.query('UPDATE Items SET active = ? WHERE Id_Item = ?', [update.active, update.id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    });
  
    res.json({ message: 'Status updated successfully' });
  });

export default router;
