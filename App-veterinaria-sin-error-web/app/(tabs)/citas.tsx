import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 120,
    paddingHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3f3f46',
    marginBottom: 8,
  },
  createButton: {
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function CitasScreen() {
  const motivosOpciones = [
    'Vacunación',
    'Consulta general',
    'Desparasitación',
    'Control',
    'Emergencia',
    'Cirugía',
    'Otro',
  ];
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [notas, setNotas] = useState('');
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showHourSelector, setShowHourSelector] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/citas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        // El backend devuelve { success: true, data: [...], citas: [...] }
        const citasArray = Array.isArray(data.data) ? data.data : Array.isArray(data.citas) ? data.citas : [];
        setCitas(citasArray);
        console.log('✅ Citas cargadas:', citasArray.length);
      } else {
        console.log('⚠️ Error al cargar citas:', data.message);
        setCitas([]);
      }
    } catch (error) {
      console.error('❌ Error de red al cargar citas:', error);
      setCitas([]);
    }
    setLoading(false);
  };

  const fetchMascotas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/mascotas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      let mascotasArray = Array.isArray(data) ? data : Array.isArray(data.mascotas) ? data.mascotas : Array.isArray(data.data) ? data.data : [];
      setMascotas(mascotasArray.filter(m => m && m.id && m.nombre));
    } catch {
      setMascotas([]);
    }
  };

  const crearCita = async () => {
    console.log('🔄 Iniciando creación de cita...');
    console.log('Token usado:', token?.substring(0, 20) + '...');
    
    let mascotaIdNum = Number(selectedMascotaId);
    if ((!mascotaIdNum || isNaN(mascotaIdNum)) && mascotas.length === 1) {
      mascotaIdNum = mascotas[0].id;
      setSelectedMascotaId(mascotaIdNum);
    }
    
    // Validar que todos los campos estén completos
    if (!mascotaIdNum || !fecha || !hora || !motivo) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }
    
    // Crear el payload exactamente como lo espera el backend
    const citaPayload = {
      mascotaId: Number(mascotaIdNum),
      fecha: fecha.trim(),
      hora: hora.trim(),
      motivo: motivo.trim(),
    };
    
    console.log('📤 Payload enviado al backend:', citaPayload);
    
    try {
      const response = await fetch(`${apiUrl}/api/v1/citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(citaPayload),
      });
      
      const data = await response.json();
      console.log('📥 Respuesta del servidor:', { status: response.status, data });
      
      if (response.ok && (data.success || data.id || data.data)) {
        console.log('✅ Cita creada exitosamente');
        Alert.alert('Éxito', 'Cita creada exitosamente');
        setCreateModalVisible(false);
        
        // Limpiar el formulario
        setSelectedMascotaId(null);
        setFecha('');
        setHora('');
        setMotivo('');
        setNotas('');
        
        // Recargar las citas
        fetchCitas();
      } else {
        console.error('❌ Error del servidor:', data.message);
        Alert.alert('Error', data.message || 'No se pudo crear la cita. Por favor intenta de nuevo.');
      }
    } catch (err) {
      console.error('❌ Error de red:', err);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchMascotas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCitas().then(() => setRefreshing(false));
  };

  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getAvailableHours = () => {
    const hours = [];
    for (let h = 8; h <= 20; h++) {
      hours.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 20) hours.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return hours;
  };

  const renderCita = ({ item }) => (
    <View style={{ marginBottom: 18, backgroundColor: '#232136', borderRadius: 18, padding: 18 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
        {item?.mascota_nombre || 'Mascota'}
      </Text>
      <Text style={{ color: '#a1a1aa', fontSize: 15 }}>
        {item?.tipo_servicio || 'Tipo de servicio'}
      </Text>
      <Text style={{ color: '#fff', fontSize: 15 }}>
        {item?.fecha ? new Date(item.fecha).toLocaleDateString('es-ES') : 'Fecha no disponible'} - {item?.hora || 'Hora'}
      </Text>
      <View style={{ 
        marginTop: 8, 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        backgroundColor: item?.estado === 'pendiente' ? '#fbbf2433' : item?.estado === 'confirmada' ? '#34d39933' : '#ef444433',
        borderRadius: 8,
        alignSelf: 'flex-start'
      }}>
        <Text style={{ 
          color: item?.estado === 'pendiente' ? '#fbbf24' : item?.estado === 'confirmada' ? '#34d399' : '#ef4444',
          fontSize: 12,
          fontWeight: '600'
        }}>
          {item?.estado?.toUpperCase() || 'ESTADO'}
        </Text>
      </View>
      {item?.descripcion && (
        <Text style={{ color: '#d4d4d8', fontSize: 14, fontStyle: 'italic', marginTop: 8 }}>
          {item.descripcion}
        </Text>
      )}
    </View>
  );

  function RenderEmpty() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>¡No tienes citas aún!</Text>
        <Text style={{ color: '#a1a1aa', fontSize: 16, textAlign: 'center', lineHeight: 22 }}>Cuando agendes una cita, aparecerá aquí para que la gestiones fácilmente.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
          />
        }
        ListEmptyComponent={RenderEmpty}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        disabled={mascotas.length === 0}
      >
        <LinearGradient
          colors={['#7c3aed', '#a78bfa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Cita</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.label}>Mascota *</Text>
              <View>
                {mascotas.length === 0 ? (
                  <Text style={{ color: '#f87171', fontSize: 16 }}>No tienes mascotas registradas.</Text>
                ) : (
                  mascotas.map((mascota) => (
                    <TouchableOpacity
                      key={mascota.id}
                      style={{ padding: 12, backgroundColor: selectedMascotaId === mascota.id ? '#7c3aed33' : '#27272a', borderRadius: 12, marginBottom: 8 }}
                      onPress={() => setSelectedMascotaId(mascota.id)}
                    >
                      <Text style={{ color: '#fff', fontWeight: selectedMascotaId === mascota.id ? 'bold' : 'normal' }}>{mascota.nombre} ({mascota.tipo})</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <Text style={styles.label}>Fecha *</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowDateSelector(true)}>
                <Text style={{ color: fecha ? '#fff' : '#71717a', fontSize: 16 }}>{fecha || 'Selecciona una fecha'}</Text>
              </TouchableOpacity>
              <Modal visible={showDateSelector} transparent animationType="fade">
                <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', alignItems:'center' }}>
                  <View style={{ backgroundColor:'#18181b', borderRadius:16, padding:20, width:'90%' }}>
                    <Text style={{ color:'#fff', fontSize:18, fontWeight:'bold', marginBottom:12 }}>Selecciona una fecha</Text>
                    <ScrollView style={{ maxHeight:300 }}>
                      {getAvailableDates().map(d => (
                        <TouchableOpacity key={d} style={{ padding:12 }} onPress={() => { setFecha(d); setShowDateSelector(false); setHora(''); }}>
                          <Text style={{ color:'#fff', fontSize:16 }}>{d}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setShowDateSelector(false)} style={{ marginTop:16, alignSelf:'flex-end' }}>
                      <Text style={{ color:'#a78bfa', fontWeight:'bold', fontSize:16 }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Text style={styles.label}>Hora *</Text>
              <TouchableOpacity style={styles.input} onPress={() => fecha && setShowHourSelector(true)} disabled={!fecha}>
                <Text style={{ color: hora ? '#fff' : '#71717a', fontSize: 16 }}>{hora || (fecha ? 'Selecciona una hora' : 'Primero selecciona fecha')}</Text>
              </TouchableOpacity>
              <Modal visible={showHourSelector} transparent animationType="fade">
                <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', alignItems:'center' }}>
                  <View style={{ backgroundColor:'#18181b', borderRadius:16, padding:20, width:'90%' }}>
                    <Text style={{ color:'#fff', fontSize:18, fontWeight:'bold', marginBottom:12 }}>Selecciona una hora</Text>
                    <ScrollView style={{ maxHeight:300 }}>
                      {getAvailableHours().map(h => (
                        <TouchableOpacity key={h} style={{ padding:12 }} onPress={() => { setHora(h); setShowHourSelector(false); }}>
                          <Text style={{ color:'#fff', fontSize:16 }}>{h}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setShowHourSelector(false)} style={{ marginTop:16, alignSelf:'flex-end' }}>
                      <Text style={{ color:'#a78bfa', fontWeight:'bold', fontSize:16 }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Text style={styles.label}>Motivo *</Text>
              <View>
                {motivosOpciones.map((opcion) => (
                  <TouchableOpacity
                    key={opcion}
                    style={{ padding: 12, backgroundColor: motivo === opcion ? '#7c3aed33' : '#27272a', borderRadius: 12, marginBottom: 8 }}
                    onPress={() => setMotivo(opcion)}
                  >
                    <Text style={{ color: '#fff', fontWeight: motivo === opcion ? 'bold' : 'normal' }}>{opcion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Notas adicionales</Text>
              <TextInput
                style={styles.input}
                value={notas}
                onChangeText={setNotas}
                placeholder="Información adicional..."
                placeholderTextColor="#71717a"
                multiline
              />
              <TouchableOpacity
                style={[styles.createButton, (!selectedMascotaId || !fecha || !hora || !motivo) && styles.createButtonDisabled]}
                onPress={crearCita}
                disabled={!selectedMascotaId || !fecha || !hora || !motivo}
              >
                <LinearGradient
                  colors={['#7c3aed', '#a78bfa']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.createButtonText}>Agregar Cita</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}



