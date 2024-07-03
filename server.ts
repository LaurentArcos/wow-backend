import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import db from './database';
import blizzardAPIRoutes from './routes/blizzard';
import itemsRoutes from './routes/items';
import prixRoutes from './routes/prix';
import achatsRoutes from './routes/achats';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API WoW',
      version: '1.0.0',
      description: 'API pour gérer des personnages, items, et transactions dans WoW.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: 'Serveur de développement'
      }
    ],
  },
  apis: ['./routes/*.ts'], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Routes pour Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Application routes
app.use('/api', blizzardAPIRoutes);
app.use('/api', itemsRoutes);
app.use('/api', prixRoutes);
app.use('/api', achatsRoutes);

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a mal tourné !');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`  🟢 Server is running on port ${PORT}`);
  console.log(`  📘 Swagger API documentation available at http://localhost:${PORT}/api-docs`);
});
