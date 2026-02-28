require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./config/database');
const seedDatabase = require('./seed');

// Importar rutas
const authRoutes = require('./routes/auth');
const mascotasRoutes = require('./routes/mascotas');
const citasRoutes = require('./routes/citas');
const fixRoleRoutes = require('./routes/fix-role');
const debugRoutes = require('./routes/debug');
const recreateAdminRoutes = require('./routes/recreate-admin');
const usersRoutes = require('./routes/users');
const adminStatsRoutes = require('./routes/admin-stats');
const citasClienteRoutes = require('./routes/citas-cliente');

const app = express();

// Middleware
// Middleware extra para forzar parseo JSON
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json' && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      req.body = {};
    }
  }
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mascotas', mascotasRoutes);
app.use('/api/v1/citas', citasRoutes);
app.use('/api/v1/citas-cliente', citasClienteRoutes);
app.use('/api/v1/fix', fixRoleRoutes);
app.use('/api/v1/debug', debugRoutes);
app.use('/api/v1/admin', recreateAdminRoutes);
app.use('/api/v1/admin', adminStatsRoutes);
app.use('/api/v1/users', usersRoutes);

// Ruta de prueba
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Backend ready - PostgreSQL/Neon connected' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// Inicializar base de datos y servidor
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    console.log('🔄 Conectando a PostgreSQL...');
    await initDatabase();
    
    // Ejecutar seed para asegurar datos críticos
    console.log('🌱 Ejecutando seed de datos...');
    await seedDatabase();
    
    // Asegurar que admin tenga rol correcto
    const { runQuery } = require('./config/database');
    await runQuery(
      "UPDATE usuarios SET rol = $1 WHERE email = $2",
      ['admin', 'admin@veterinaria.com']
    );
    console.log('✅ Rol admin verificado');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📡 CORS habilitado para todas las direcciones`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log(`🏥 API de Veterinaria lista`);
    });
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
})();

module.exports = app;
