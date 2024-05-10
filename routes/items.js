const express = require('express');
const db = require('../database');
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
router.get('/items', (req, res) => {
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
router.post('/ajouterItem', (req, res) => {
    const { nom, image } = req.body;
    db.query('INSERT INTO Items (nom, image) VALUES (?, ?)', [nom, image], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Nouvel item ajouté avec succès: ${nom}` });
    });
});

module.exports = router;
