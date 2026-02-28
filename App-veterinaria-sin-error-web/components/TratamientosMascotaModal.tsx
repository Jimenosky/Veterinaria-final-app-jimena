import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { View, Text, StyleSheet, ScrollView, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TratamientoItem {
  id: number;
  fecha_inicio: string;
  fecha_fin?: string;
  tipo: string;
  descripcion: string;
  medicamento?: string;
  dosis?: string;
}

interface Props {
  mascotaId: number;
  visible: boolean;
  onClose: () => void;
  nombreMascota: string;
}

const TratamientosMascotaModal: React.FC<Props> = ({ mascotaId, visible, onClose, nombreMascota }) => {
    const { token } = useAuth();
  const [tratamientos, setTratamientos] = useState<TratamientoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (visible && mascotaId) {
      fetchTratamientos();
    }
  }, [visible, mascotaId]);

  const fetchTratamientos = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/v1/mascotas/${mascotaId}/tratamientos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Si la respuesta no es JSON (por ejemplo, HTML de error), manejarlo
      let data;
      try {
        data = await response.json();
      } catch (e) {
        setErrorMsg('No se pudo conectar con el servidor. Intenta más tarde.');
        setTratamientos([]);
        return;
      }
      if (data.success) {
        setTratamientos(data.data);
      } else {
        setTratamientos([]);
        setErrorMsg(data.message || 'No se pudieron cargar los tratamientos.');
      }
    } catch (error) {
      setTratamientos([]);
      setErrorMsg('Error de red o autenticación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.modalContainer, { width: '95%', maxHeight: '85%', paddingTop: 12, paddingBottom: 12 }]}> 
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, { alignSelf: 'center', marginBottom: 8 }]}>Tratamientos de {nombreMascota}</Text>
          <Text style={{ color: '#a1a1aa', fontSize: 14, marginBottom: 8, textAlign: 'center' }}>
            Aquí se muestran las citas programadas o en proceso como tratamientos activos.
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 40 }} />
          ) : errorMsg ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontSize: 16, marginTop: 16, textAlign: 'center' }}>{errorMsg}</Text>
            </View>
          ) : tratamientos.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Ionicons name="medkit-outline" size={48} color="#a1a1aa" />
              <Text style={{ color: '#a1a1aa', fontSize: 16, marginTop: 16 }}>No hay tratamientos activos para esta mascota.</Text>
              <Text style={{ color: '#a1a1aa', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                Los tratamientos se muestran aquí cuando agendas una cita programada o en proceso.
              </Text>
            </View>
          ) : (
            <ScrollView style={{ marginTop: 16 }}>
              {tratamientos.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <LinearGradient colors={["#f59e0b", "#fbbf24"]} style={styles.itemHeader}>
                    <Ionicons name="medkit" size={20} color="#fff" />
                    <Text style={styles.itemTipo}>{item.tipo}</Text>
                  </LinearGradient>
                  <Text style={styles.itemFecha}>{item.fecha_inicio}</Text>
                  <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#18181b',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#a1a1aa',
  },
  content: {
    maxHeight: '70%',
  },
  emptyText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: '#fff',
  },
  cardMed: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
});

export default TratamientosMascotaModal;
