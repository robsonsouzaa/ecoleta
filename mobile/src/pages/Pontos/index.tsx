import React, { useState, useEffect } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
  id: number,
  titulo: string;
  imagem_url: string;
}

interface Ponto {
  id: number;
  imagem: string;
  imagem_url: string;
  nome:string;
  latitude: number,
  longitude: number,
  cidade: string;
  uf: string;
}

interface Params {
  estado: string;
  cidade: string;
}

const Pontos = () => {

  const [itens, setItens] = useState<Item[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [posicaoInicial, setPosicaoInicial] = useState<[number, number]>([0, 0]);
  
  const navigation = useNavigation();
  const rota = useRoute();

  const parametrosRota = rota.params as Params;

  useEffect(() => {

    async function carregaPosicao() {

      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Oooops', 'Precisamos de sua permissão para obter sua localização! :)');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setPosicaoInicial([
        latitude,
        longitude,
      ]);
    }

    carregaPosicao();
  },[]);

  useEffect(() => {
    api.get('itens').then(response => {
      setItens(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('pontos', {
      params: {
        cidade: parametrosRota.cidade,
        uf: parametrosRota.estado,
        itens: itensSelecionados
      }
    }).then(response => {
      setPontos(response.data);
    });
  }, [itensSelecionados]);

  function navegacaoVoltar() {
    navigation.goBack();
  }

  function navegarParaDetalhes(id: number) {
    navigation.navigate('Detalhes', { ponto_id: id });
  }

  function ArmazenaItensSelecionados(id: number) {

    const selecionado = itensSelecionados.findIndex(item => item === id);

    if(selecionado >=0) {
      
      const itensfiltrados = itensSelecionados.filter(item => item !== id );
      setItensSelecionados(itensfiltrados);

    } else {
      setItensSelecionados([...itensSelecionados, id]);
    }
    
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity onPress={navegacaoVoltar}>
        <Icon name="arrow-left" size={20} color="#34cb79"/>
      </TouchableOpacity>

      <Text style={styles.title}>Bem Vindo.</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
      

      <View style={styles.mapContainer}>
        { posicaoInicial[0] !== 0 && (
          <MapView 
          style={styles.map} 
          loadingEnabled={ posicaoInicial[0] === 0 }
          initialRegion={{
            latitude: posicaoInicial[0],
            longitude: posicaoInicial[1],
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
          }}
        >
          
          {pontos.map(ponto => (
            <Marker 
            key={String(ponto.id)}
            style={styles.mapMarker}
            onPress={() => navegarParaDetalhes(ponto.id)}
            coordinate={{
              latitude: ponto.latitude,
              longitude: ponto.longitude,
            }}
          >
            <View style={styles.mapMarkerContainer}>
            <Image
              style={styles.mapMarkerImage} 
              source={{ uri: ponto.imagem_url }} />
            <Text style={styles.mapMarkerTitle}>{ponto.nome}</Text>
            </View>
            </Marker>
          ))}
          
        </MapView>
        )}
      </View>

    </View>

    <View style={styles.itemsContainer}>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        >
        {itens.map(item => (
          <TouchableOpacity 
            key={String(item.id)} 
            style={[
              styles.item,
              itensSelecionados.includes(item.id) ? styles.selectedItem : {}
            ]} 
            onPress={() => ArmazenaItensSelecionados(item.id)}
            activeOpacity={0.6}
            >
            <SvgUri width={42} height={42} uri={item.imagem_url} />
            <Text style={styles.itemTitle}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>

    </View>
    </SafeAreaView>
  );
}

export default Pontos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 10,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});