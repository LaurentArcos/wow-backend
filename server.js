require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const db = require('./database');
const blizzardAPIRoutes = require('./routes/blizzard');
const itemsRoutes = require('./routes/items');
const prixRoutes = require('./routes/prix');
const achatsRoutes = require('./routes/achats');

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
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Routes pour Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Application routes
app.use('/api/blizzard', blizzardAPIRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/prix', prixRoutes);
app.use('/api/achats', achatsRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a mal tourné !');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`);
  console.log(`📘 Swagger API documentation available at http://localhost:${PORT}/api-docs`);
});
