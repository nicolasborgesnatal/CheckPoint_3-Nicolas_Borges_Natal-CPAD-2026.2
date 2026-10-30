import { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function DetalheScreen({ route }) {
  // Id, nome e imagem enviados pela ListaScreen
  const { id, nome, imagem } = route.params;
  const [episodios, setEpisodios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarEpisodios() {
      try {
        // Template literal monta a URL com o id da série
        const resposta = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);

        if (!resposta.ok) {
          throw new Error('Erro HTTP ' + resposta.status);
        }

        const json = await resposta.json();
        setEpisodios(json);
      } catch (e) {
        console.log(e);
        setErro('Não foi possível carregar os episódios.');
      } finally {
        setCarregando(false);
      }
    }
    buscarEpisodios();
  }, [id]);

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

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View style={styles.fotoBox}>
          {/* Imagem vem undefined quando a série não tem foto */}
          {imagem && <Image source={{ uri: imagem }} style={styles.foto} />}
        </View>
        <View style={styles.info}>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.total}>{episodios.length} episódios</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>Episódios</Text>

      <FlatList
        style={styles.lista}
        data={episodios}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.episodio}>
            {/* Number vem null em episódios especiais */}
            <Text style={styles.numero}>
              Temporada {item.season} · Episódio {item.number ?? '-'}
            </Text>
            <Text style={styles.titulo}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#141414' },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141414',
  },
  erro: { fontSize: 18, color: '#E50914', textAlign: 'center' },
  cabecalho: { flexDirection: 'row', alignItems: 'center' },
  fotoBox: { width: 100, height: 143, backgroundColor: '#333', borderRadius: 6, overflow: 'hidden' },
  foto: { width: '100%', height: '100%' },
  info: { flex: 1, marginLeft: 16 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  total: { fontSize: 15, color: '#b3b3b3', marginTop: 6 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 24, marginBottom: 8 },
  lista: { flex: 1 },
  episodio: { backgroundColor: '#1f1f1f', padding: 12, marginBottom: 8, borderRadius: 6 },
  numero: { fontSize: 13, fontWeight: 'bold', color: '#E50914' },
  titulo: { fontSize: 16, color: '#fff', marginTop: 4 },
});