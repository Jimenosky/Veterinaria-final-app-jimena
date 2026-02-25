import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface Cita {
  id: number;
  mascota_nombre: string;
  tipo_servicio: string;
  descripcion?: string;
  fecha: string;
  hora: string;
  estado: string;
}

export default function CitasView() {
  const { token } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const fetchCitas = async () => {
    try {
      const response = await fetch('https://api-express-mysql-de-jime.onrender.com/api/v1/citas/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCitas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCitas();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return ['#f59e0b', '#f97316'];
      case 'confirmada':
        return ['#10b981', '#059669'];
      case 'cancelada':
        return ['#ef4444', '#dc2626'];
      case 'completada':
        return ['#3b82f6', '#2563eb'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'time';
      case 'confirmada':
        return 'checkmark-circle';
      case 'cancelada':
        return 'close-circle';
      case 'completada':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  const renderCita = ({ item }: { item: Cita }) => (
    <TouchableOpacity onPress={() => { setSelectedCita(item); setModalVisible(true); }}>
      <View style={styles.citaCard}>
        <View style={styles.citaHeader}>
          <View style={styles.citaHeaderLeft}>
            <Ionicons name="paw" size={24} color="#7c3aed" />
            <View style={styles.citaHeaderText}>
              <Text style={styles.citaMascota}>{item.mascota_nombre}</Text>
              <Text style={styles.citaTipo}>{item.tipo_servicio}</Text>
            </View>
          </View>
          <LinearGradient
            colors={getEstadoColor(item.estado)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.estadoBadge}
          >
            <Ionicons name={getEstadoIcon(item.estado) as any} size={14} color="#fff" />
            <Text style={styles.estadoText}>{item.estado}</Text>
          </LinearGradient>
        </View>

        {item.descripcion && (
          <Text style={styles.citaDescripcion}>{item.descripcion}</Text>
        )}

        <View style={styles.citaFooter}>
          <View style={styles.citaInfo}>
            <Ionicons name="calendar" size={16} color="#a1a1aa" />
            <Text style={styles.citaInfoText}>{new Date(item.fecha).toLocaleDateString('es-ES')}</Text>
          </View>
          <View style={styles.citaInfo}>
            <Ionicons name="time" size={16} color="#a1a1aa" />
            <Text style={styles.citaInfoText}>{item.hora}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  if (citas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#7c3aed', '#a78bfa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="calendar-outline" size={60} color="#fff" />
        </LinearGradient>
        <Text style={styles.emptyTitle}>No tienes citas</Text>
        <Text style={styles.emptyText}>
          Cuando agendes una cita, aparecerá aquí
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
          />
        }
      />
      {selectedCita && (
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '90%', backgroundColor: '#18181b', borderRadius: 20, padding: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 12 }}>Detalle de la cita</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>Mascota: {selectedCita.mascota_nombre}</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>Servicio: {selectedCita.tipo_servicio}</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>Fecha: {new Date(selectedCita.fecha).toLocaleDateString('es-ES')}</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>Hora: {selectedCita.hora}</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>Estado: {selectedCita.estado}</Text>
              {selectedCita.descripcion && <Text style={{ color: '#d4d4d8', fontSize: 15, marginTop: 8 }}>Descripción: {selectedCita.descripcion}</Text>}
              <TouchableOpacity style={{ marginTop: 24, backgroundColor: '#3f3f46', borderRadius: 12, padding: 16, alignItems: 'center' }} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#a1a1aa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  citaCard: {
    backgroundColor: '#27272a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  citaHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  citaHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  citaMascota: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  citaTipo: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  citaDescripcion: {
    fontSize: 14,
    color: '#d4d4d8',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  citaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3f3f46',
  },
  citaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  citaInfoText: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '500',
  },
});
