import React, { useEffect, useState } from 'react';
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
  const [tratamientos, setTratamientos] = useState<TratamientoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible && mascotaId) {
      fetchTratamientos();
    }
  }, [visible, mascotaId]);

  const fetchTratamientos = async () => {
    setLoading(true);
    try {
      // Cambia la URL por la del endpoint real
      const response = await fetch(`https://api-express-mysql-de-jime.onrender.com/api/v1/mascotas/${mascotaId}/tratamientos`);
      const data = await response.json();
      if (data.success) {
        setTratamientos(data.data);
      } else {
        setTratamientos([]);
      }
    } catch (error) {
      setTratamientos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Tratamientos de {nombreMascota}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={styles.loadingText}>Cargando tratamientos...</Text>
            </View>
          ) : (
            <ScrollView style={styles.content}>
              {tratamientos.length === 0 ? (
                <Text style={styles.emptyText}>No hay tratamientos registrados.</Text>
              ) : (
                tratamientos.map((item) => (
                  <LinearGradient key={item.id} colors={["#f59e0b", "#f97316"]} style={styles.card}>
                    <Text style={styles.cardDate}>Inicio: {item.fecha_inicio}</Text>
                    {item.fecha_fin && <Text style={styles.cardDate}>Fin: {item.fecha_fin}</Text>}
                    <Text style={styles.cardType}>{item.tipo}</Text>
                    <Text style={styles.cardDesc}>{item.descripcion}</Text>
                    {item.medicamento && <Text style={styles.cardMed}>Medicamento: {item.medicamento}</Text>}
                    {item.dosis && <Text style={styles.cardMed}>Dosis: {item.dosis}</Text>}
                  </LinearGradient>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#18181b',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
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
