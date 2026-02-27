const express = require('express');
const { getQuery, runQuery, allQuery } = require('../config/database');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// OBTENER CITAS DEL USUARIO (Cliente)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const citas = await allQuery(
      `SELECT 
        c.id,
        c.mascota_id,
        c.usuario_id,
        TO_CHAR(c.fecha_hora, 'YYYY-MM-DD') AS fecha,
        TO_CHAR(c.fecha_hora, 'HH24:MI') AS hora,
        c.motivo AS tipo_servicio,
        c.notas AS descripcion,
        c.estado,
        m.nombre AS mascota_nombre,
        m.tipo AS mascota_tipo,
        u.nombre AS veterinario_nombre
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.usuario_id = $1
       ORDER BY c.fecha_hora DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener citas' });
  }
});

// OBTENER TODAS LAS CITAS (Solo Admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const citas = await allQuery(
      `SELECT 
        c.id,
        c.mascota_id,
        c.usuario_id,
        TO_CHAR(c.fecha_hora, 'YYYY-MM-DD') AS fecha,
        TO_CHAR(c.fecha_hora, 'HH24:MI') AS hora,
        c.motivo AS tipo_servicio,
        c.notas AS descripcion,
        c.estado,
        m.nombre AS mascota_nombre,
        m.tipo AS mascota_tipo,
        u.nombre AS usuario_nombre,
        u.email AS usuario_email,
        u.telefono
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY c.fecha_hora DESC`
    );

    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener citas' });
  }
});

// CREAR CITA (Cliente)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mascota_id, fecha_hora, motivo, notas } = req.body;

    if (!mascota_id || !fecha_hora || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'mascota_id, fecha_hora y motivo son requeridos',
      });
    }

    // Verificar que la mascota pertenece al usuario
    const mascota = await getQuery('SELECT * FROM mascotas WHERE id = $1 AND usuario_id = $2', [mascota_id, req.user.id]);
    if (!mascota) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }

    const result = await runQuery(
      `INSERT INTO citas (usuario_id, mascota_id, fecha_hora, motivo, notas, estado) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user.id, mascota_id, fecha_hora, motivo, notas || null, 'programada']
    );

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: {
        id: result.id,
        usuario_id: req.user.id,
        mascota_id,
        fecha_hora,
        motivo,
        notas,
        estado: 'programada',
      },
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ success: false, message: 'Error al crear cita' });
  }
});

// OBTENER CITA POR ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const cita = await getQuery(
      `SELECT 
        c.id,
        c.mascota_id,
        c.usuario_id,
        TO_CHAR(c.fecha_hora, 'YYYY-MM-DD') AS fecha,
        TO_CHAR(c.fecha_hora, 'HH24:MI') AS hora,
        c.motivo AS tipo_servicio,
        c.notas AS descripcion,
        c.estado,
        m.nombre AS mascota_nombre,
        m.tipo AS mascota_tipo
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Verificar que pertenece al usuario (a menos que sea admin)
    if (req.user.rol !== 'admin' && cita.usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
    }

    res.json({ success: true, data: cita });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cita' });
  }
});

// ACTUALIZAR CITA
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { fecha_hora, motivo, notas, estado } = req.body;
    const citaId = req.params.id;

    const cita = await getQuery('SELECT * FROM citas WHERE id = $1', [citaId]);
    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Clientes solo pueden modificar citas programadas
    if (req.user.rol !== 'admin') {
      if (cita.usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
      }
      if (cita.estado !== 'programada') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden modificar citas programadas',
        });
      }
    }

    const updateQuery = `
      UPDATE citas 
      SET fecha_hora = $1, motivo = $2, notas = $3, estado = $4
      WHERE id = $5
    `;

    await runQuery(updateQuery, [
      fecha_hora || cita.fecha_hora,
      motivo || cita.motivo,
      notas !== undefined ? notas : cita.notas,
      estado || cita.estado,
      citaId,
    ]);

    res.json({ success: true, message: 'Cita actualizada' });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar cita' });
  }
});

// CANCELAR CITA (Cliente)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const citaId = req.params.id;

    const cita = await getQuery('SELECT * FROM citas WHERE id = $1', [citaId]);
    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Verificar que pertenece al usuario
    if (cita.usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
    }

    // Solo se puede cancelar si no está completada
    if (cita.estado === 'completada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una cita ya completada',
      });
    }

    await runQuery('UPDATE citas SET estado = $1 WHERE id = $2', ['cancelada', citaId]);

    res.json({ success: true, message: 'Cita cancelada' });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ success: false, message: 'Error al cancelar cita' });
  }
});

// ELIMINAR CITA (solo admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM citas WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Cita eliminada' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cita' });
  }
});

module.exports = router;
