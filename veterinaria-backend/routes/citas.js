const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { runQuery, allQuery } = require('../config/database');

// Endpoint temporal para probar conexión a la base de datos (SIN autenticación)
router.get('/test-db', async (req, res) => {
  try {
    const result = await runQuery('SELECT NOW()');
    res.json({ success: true, message: 'Conexión exitosa', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error de conexión', error: error.message });
  }
});

// Crear una nueva cita en la base de datos
router.post('/', authenticateToken, async (req, res) => {
  const { mascotaId, fecha, hora, motivo } = req.body;

  // Validar campos requeridos
  if (!mascotaId || !fecha || !hora || !motivo) {
    console.log('Validación falló. Datos recibidos:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Los campos mascotaId, fecha, hora y motivo son obligatorios.',
      received: req.body
    });
  }

  console.log('✅ Creando cita - Usuario:', req.user.id, 'Mascota:', mascotaId, 'Fecha:', fecha, 'Hora:', hora, 'Motivo:', motivo);

  try {
    // Insertar cita en la base de datos con los nombres correctos de las columnas
    const result = await runQuery(
      'INSERT INTO citas (mascota_id, usuario_id, fecha, hora, tipo_servicio, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [mascotaId, req.user.id, fecha, hora, motivo, 'pendiente']
    );
    
    console.log('✅ Cita creada exitosamente:', result.rows[0]);
    
    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la cita.',
      error: error.message
    });
  }
});

// Obtener todas las citas de un usuario desde la base de datos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const citasUsuario = await allQuery(
      `SELECT c.*, m.nombre as mascota_nombre, m.tipo as mascota_tipo 
       FROM citas c 
       JOIN mascotas m ON c.mascota_id = m.id 
       WHERE c.usuario_id = $1 
       ORDER BY c.fecha DESC, c.hora DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: citasUsuario,
      citas: citasUsuario
    });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener citas',
      data: []
    });
  }
});

// Obtener una cita específica desde la base de datos
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await runQuery(
      `SELECT c.*, m.nombre as mascota_nombre, m.tipo as mascota_tipo 
       FROM citas c 
       JOIN mascotas m ON c.mascota_id = m.id 
       WHERE c.id = $1 AND c.usuario_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada.',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cita',
    });
  }
});

// Cancelar una cita en la base de datos
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await runQuery(
      'UPDATE citas SET estado = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
      ['cancelada', req.params.id, req.user.id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada.',
      });
    }

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la cita',
    });
  }
});

module.exports = router;
