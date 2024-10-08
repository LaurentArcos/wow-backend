import express, { Request, Response } from 'express';
import db from '../database';
import { RowDataPacket } from 'mysql2';
const router = express.Router();

/**
 * @swagger
 * /prix:
 *   get:
 *     tags:
 *       - Prix
 *     summary: Retrieve all price records
 *     description: Returns a list of all price records in the database.
 *     responses:
 *       200:
 *         description: A list of price records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id_Prix:
 *                     type: integer
 *                     description: The ID of the price record.
 *                   Id_Item:
 *                     type: integer
 *                     description: The ID of the related item.
 *                   Prix:
 *                     type: number
 *                     description: The price of the item.
 *                   Date:
 *                     type: string
 *                     format: date
 *                     description: The date the price was recorded.
 *       500:
 *         description: Server error
 */
router.get('/prix', (req: Request, res: Response) => {
    db.query('SELECT * FROM prix', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /ajouterPrix:
 *   post:
 *     tags:
 *       - Prix
 *     summary: Add new price records
 *     description: Adds new price records to the database for one or more items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the item.
 *                 price:
 *                   type: number
 *                   description: The price to record.
 *     responses:
 *       200:
 *         description: Prices added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Les prix suivants ont été ajoutés avec succès:..."
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/ajouterPrix', (req: Request, res: Response) => {
    const prixData: { name: string; price: number }[] = req.body;

    prixData.forEach(data => {
        const { name, price } = data;

        db.query('SELECT Id_Item FROM items WHERE nom = ?', [name], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const rows = results as RowDataPacket[];

            if (rows.length > 0) {
                const itemId = rows[0].Id_Item;
                const today = new Date().toISOString().slice(0, 10);

                db.query('INSERT INTO prix (Id_Item, Date, Prix) VALUES (?, ?, ?)', [itemId, today, price], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                });
            }
        });
    }); 
    const res_send_prix = "Les prix suivants ont été ajoutés avec succès:\n" +
        prixData.map(data => `Nom: ${data.name}, Prix: ${data.price}`).join('\n');
    res.send(res_send_prix);
});

export default router;
