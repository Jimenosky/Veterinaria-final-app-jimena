import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HistorialItem {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
}

interface Props {
  mascotaId: number;
  visible: boolean;
  onClose: () => void;
  nombreMascota: string;
}

const HistorialMascotaModal: React.FC<Props> = ({ mascotaId, visible, onClose, nombreMascota }) => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible && mascotaId) {
      fetchHistorial();
    }
  }, [visible, mascotaId]);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      // Cambia la URL por la del endpoint real
      const response = await fetch(`https://api-express-mysql-de-jime.onrender.com/api/v1/mascotas/${mascotaId}/historial`);
      const data = await response.json();
      if (data.success) {
        setHistorial(data.data);
      } else {
        setHistorial([]);
      }
    } catch (error) {
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Historial de {nombreMascota}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Cargando historial...</Text>
            </View>
          ) : (
            <ScrollView style={styles.content}>
              {historial.length === 0 ? (
                <Text style={styles.emptyText}>No hay historial médico registrado.</Text>
              ) : (
                historial.map((item) => (
                  <LinearGradient key={item.id} colors={["#10b981", "#059669"]} style={styles.card}>
                    <Text style={styles.cardDate}>{item.fecha}</Text>
                    <Text style={styles.cardType}>{item.tipo}</Text>
                    <Text style={styles.cardDesc}>{item.descripcion}</Text>
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
});

export default HistorialMascotaModal;
