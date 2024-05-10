const express = require('express');
const db = require('../database'); 
const router = express.Router();

/**
 * @swagger
 * /api/achats:
 *   get:
 *     tags:
 *       - Achats
 *     summary: Récupère tous les achats
 *     description: Retourne une liste de tous les achats enregistrés dans la base de données.
 *     responses:
 *       200:
 *         description: Une liste des achats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id_Achat:
 *                     type: integer
 *                     description: ID de l'achat
 *                   Id_Item:
 *                     type: integer
 *                     description: ID de l'article acheté
 *                   Quantite:
 *                     type: integer
 *                     description: Quantité achetée
 *                   PrixUnitaire:
 *                     type: number
 *                     format: float
 *                     description: Prix unitaire de l'article
 *                   DateAchat:
 *                     type: string
 *                     format: date
 *                     description: Date à laquelle l'achat a été effectué
 *                   Active:
 *                     type: boolean
 *                     description: Statut actif de l'achat
 */

router.get('/achats', async (req, res) => {
  db.query('SELECT * FROM achats', (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(results);
});
});

/**
 * @swagger
 * /api/ajouterAchat:
 *   post:
 *     tags:
 *       - Achats
 *     summary: Ajoute un nouvel achat
 *     description: Ajoute un enregistrement d'achat à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Id_Item
 *               - Quantite
 *               - PrixUnitaire
 *               - DateAchat
 *             properties:
 *               Id_Item:
 *                 type: integer
 *                 description: ID de l'article acheté
 *               Quantite:
 *                 type: integer
 *                 description: Quantité d'articles achetés
 *               PrixUnitaire:
 *                 type: number
 *                 format: float
 *                 description: Prix unitaire de l'article
 *               DateAchat:
 *                 type: string
 *                 format: date
 *                 description: Date de l'achat
 *     responses:
 *       200:
 *         description: Achat ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Achat ajouté avec succès
 *       400:
 *         description: Informations manquantes pour l'achat
 *       500:
 *         description: Erreur serveur
 */

router.post('/ajouterAchat', async (req, res) => {
  const { Id_Item, Quantite, PrixUnitaire, DateAchat } = req.body;

  db.query('INSERT INTO achats (Id_Item, Quantite, PrixUnitaire, DateAchat) VALUES (?, ?, ?, ?)', 
  [Id_Item, Quantite, PrixUnitaire, DateAchat], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      const res_send_achat = `Achat ajouté avec succès:\nId Item: ${Id_Item}, Quantité: ${Quantite}, Prix Unit.: ${PrixUnitaire}, Date Achat: ${DateAchat}`;
      res.send(res_send_achat);
  });
});

/**
 * @swagger
 * /api/modifierAchatActive:
 *   post:
 *     tags:
 *       - Achats
 *     summary: Modifie le statut d'un achat
 *     description: Modifie le statut 'Active' d'un achat existant dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Id_Achat
 *               - Active
 *             properties:
 *               Id_Achat:
 *                 type: integer
 *                 description: ID de l'achat à modifier
 *               Active:
 *                 type: boolean
 *                 description: Nouveau statut actif de l'achat
 *     responses:
 *       200:
 *         description: Statut de l'achat modifié avec succès
 *       400:
 *         description: ID de l'achat manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */

router.post('/modifierAchatActive', async (req, res) => {
  const { id, active } = req.body;
  if (id == null) { 
    return res.status(400).json({ error: "L'ID de l'achat est manquant." });
  }

  db.query('UPDATE achats SET Active = ? WHERE Id_Achat = ?', [active, id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.send(`Achat avec ID_Achat: ${id} a été modifié avec succès.`);
  });
});

module.exports = router;