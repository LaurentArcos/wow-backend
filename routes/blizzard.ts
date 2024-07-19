import express, { Request, Response } from 'express';
import {
  getCharacterAppearance,
  getUserProfile,
  getCharacterMedia,
  getCharacterAchievementsSummary,
  getCharacterAchievementsStatistics,
  getTokenInfo
} from '../blizzardAPI';
const router = express.Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Récupère le profil utilisateur, y compris la liste des personnages
 *     description: Renvoie les détails du profil utilisateur, y compris la liste des personnages.
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/user/profile', async (req: Request, res: Response) => {
  try {
    const data = await getUserProfile();
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /character/appearance/{realm}/{characterName}:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Récupère l'apparence d'un personnage
 *     description: Renvoie les détails de l'apparence d'un personnage spécifique dans le jeu.
 *     parameters:
 *       - in: path
 *         name: realm
 *         required: true
 *         description: Le royaume du personnage
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterName
 *         required: true
 *         description: Le nom du personnage
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'apparence du personnage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/character/appearance/:realm/:characterName', async (req: Request, res: Response) => {
  try {
    const { realm, characterName } = req.params;
    const data = await getCharacterAppearance(realm, characterName);
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /character/media/{realm}/{characterName}:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Récupère les médias d'un personnage
 *     description: Renvoie les médias associés à un personnage spécifique, tels que les images.
 *     parameters:
 *       - in: path
 *         name: realm
 *         required: true
 *         description: Le royaume du personnage
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterName
 *         required: true
 *         description: Le nom du personnage
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médias du personnage récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/character/media/:realm/:characterName', async (req: Request, res: Response) => {
  try {
    const { realm, characterName } = req.params;
    const data = await getCharacterMedia(realm, characterName);
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /character/achievements/summary/{realm}/{characterName}:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Récupère le résumé des succès d'un personnage
 *     description: Renvoie un résumé des succès obtenus par un personnage.
 *     parameters:
 *       - in: path
 *         name: realm
 *         required: true
 *         description: Le royaume du personnage
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterName
 *         required: true
 *         description: Le nom du personnage
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résumé des succès du personnage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/character/achievements/summary/:realm/:characterName', async (req: Request, res: Response) => {
  try {
    const { realm, characterName } = req.params;
    const data = await getCharacterAchievementsSummary(realm, characterName);
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /character/achievements/statistics/{realm}/{characterName}:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Récupère les statistiques des succès d'un personnage
 *     description: Renvoie les statistiques détaillées des succès d'un personnage.
 *     parameters:
 *       - in: path
 *         name: realm
 *         required: true
 *         description: Le royaume du personnage
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterName
 *         required: true
 *         description: Le nom du personnage
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques des succès du personnage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/character/achievements/statistics/:realm/:characterName', async (req: Request, res: Response) => {
  try {
    const { realm, characterName } = req.params;
    const data = await getCharacterAchievementsStatistics(realm, characterName);
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /tokeninfo:
 *   get:
 *     tags:
 *       - Blizzard
 *     summary: Retrieve the current World of Warcraft token price and last update timestamp
 *     description: Provides the current price of a World of Warcraft token along with the last updated timestamp.
 *     responses:
 *       200:
 *         description: Successful retrieval of token information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 price:
 *                   type: integer
 *                   description: The price of the WoW token in game currency (in hundredths of a cent)
 *                 last_updated_timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: The last time the token price was updated
 *       500:
 *         description: Internal server error
 */
router.get('/tokeninfo', async (req: Request, res: Response) => {
  try {
    const data = await getTokenInfo();
    res.json(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default router;
