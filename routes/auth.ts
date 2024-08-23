import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database';
import { body, validationResult } from 'express-validator';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Route d'inscription
router.post('/register', 
[
   body('username').isLength({ min: 4 }).withMessage('Veuillez fournir un identifiant valide.')
      .matches(/[A-Z]/).withMessage('Votre identifiant doit contenir au moins une majuscule.'),
   body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
      .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
      .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
      .matches(/[!@#\$%\^&\*]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.'),
], async (req: Request, res: Response) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   const { username, password } = req.body;

   try {
      // Vérifier si l'utilisateur existe déjà
      db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results: RowDataPacket[]) => { // Utilisation de RowDataPacket
        if (results.length > 0) {
            return res.status(400).json({ message: 'Cet identifiant est déjà utilisé.' });
        }
    
        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Insérer le nouvel utilisateur dans la base de données
        db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', 
        [username, hashedPassword], (err, result: ResultSetHeader) => { // Utilisation de ResultSetHeader
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
            }
    
            // Créer et retourner un token JWT
            const token = jwt.sign({ id: result.insertId, username }, process.env.JWT_SECRET!, {
                expiresIn: '1h',
            });
    
            res.status(201).json({ token });
        });
    });
   } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
   }
});

// Route de connexion
router.post('/login', 
[
   body('username').isLength({ min: 4 }).withMessage('Veuillez fournir un identifiant valide.'),  // Validation pour le username
   body('password').exists().withMessage('Le mot de passe est requis.')
], async (req: Request, res: Response) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   const { username, password } = req.body;

   try {
      // Vérifier si l'utilisateur existe
      db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results: RowDataPacket[]) => {
        if (results.length === 0) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }
    
        const user = results[0];
    
        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }
    
        // Créer et retourner un token JWT
        const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });
    
        res.json({ token });
    });
   } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
   }
});

export default router;
