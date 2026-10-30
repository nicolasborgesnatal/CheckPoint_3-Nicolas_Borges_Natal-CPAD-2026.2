import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaScreen({ navigation }) {
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarSeries() {
      try {
        const resposta = await fetch('https://api.tvmaze.com/shows');

        // Fetch não cai no catch com erro HTTP (404, 500), então lançamos o erro
        if (!resposta.ok) {
          throw new Error('Erro HTTP ' + resposta.status);
        }

        const json = await resposta.json();
        setSeries(json);
      } catch (e) {
        console.log(e);
        setErro('Não foi possível carregar as séries. Verifique sua conexão.');
      } finally {
        setCarregando(false);
      }
    }
    buscarSeries();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  // SafeAreaView adiciona o espaço da barra de status de cada aparelho
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Image source={require('../assets/img/logo.png')} style={styles.logo} />
      <Text style={styles.secao}>Séries</Text>

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        // Grade de capas com 4 por linha
        numColumns={4}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('Detalhe', {
                id: item.id,
                nome: item.name,
                imagem: item.image?.medium,
              })
            }
          >
            <View style={styles.fotoBox}>
              {/* Image pode vir null da API */}
              {item.image && <Image source={{ uri: item.image.medium }} style={styles.foto} />}
            </View>
            <Text style={styles.nome} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141414',
  },
  erro: { fontSize: 18, color: '#E50914', textAlign: 'center' },
  logo: { width: 140, height: 38, resizeMode: 'contain', marginLeft: 12, marginTop: 12 },
  secao: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8, marginLeft: 12 },
  lista: { paddingHorizontal: 8, paddingBottom: 12 },
  item: { width: '25%', padding: 4, marginBottom: 8 },
  fotoBox: { width: '100%', aspectRatio: 0.7, backgroundColor: '#333', borderRadius: 6, overflow: 'hidden' },
  foto: { width: '100%', height: '100%' },
  nome: { fontSize: 13, color: '#e5e5e5', marginTop: 6 },
});