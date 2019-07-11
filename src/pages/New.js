import React, { Component } from 'react';
import api from '../services/api';
import ImagePicker from 'react-native-image-picker';

import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native';

export default class New extends Component {
  static navigationOptions = {
    headerTitle: 'Nova publicação'
  };

  state = {
    preview: null,
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
  }

  handleSelectImage = () => {

    ImagePicker.showImagePicker({
      title: 'Selecionar Imagem',
    }, upload => {
       if(upload.error) {
         console.log('Error');
       } else if (upload.didCancel) {
         console.log('Used Canceled');
       } else {
         const preview = {
           uri: `data:image/jpeg;base64,${upload.data}`,
         }

         let prefix;
         let ext;

         //No IOS no filename quanto tira a foto ela vem sem o nome, para isso 
         //termos que fazer uma verificação se existe um nome
         if (upload.fileName) {
          [prefix, ext] = upload.fileName.split('.')
          ext = ext.toLocaleLowerCase() == 'heic' ? 'jpg' : ext;
         } else {
           // criar um nome para imagem com a data e hora do sistema
           prefix = new  Date().getTime();
           ext = 'jpg';
         }
         
         //Criar um objeto de imagem 
         const image = {
           uri: upload.uri,
           type: upload.type,
           name: `${prefix}.${ext}`,
         }

        this.setState( { preview, image } );
      }
    })
  }

  handleSubmit = async () => {
    const data = new FormData();

    data.append('image', this.state.image);
    data.append('author', this.state.author);
    data.append('place', this.state.place);
    data.append('description', this.state.description);
    data.append('hashtags', this.state.hashtags);

    await api.post('posts', data)

    //Redirecionar a página Feed
    this.props.navigation.navigate('Feed');
  }

  render() {
    return(
      <View style={styles.container}>

        <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
          <Text style={styles.selectButtonText}> Selecionar Imagem </Text>
        </TouchableOpacity>

        {/* Se existir uma imagem selecionada exibe a imagem */}
        { this.state.preview && <Image style={styles.preview} source={this.state.preview} /> }

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          onChangeText={author => this.setState({author})}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Local da Foto"
          placeholderTextColor="#999"
          onChangeText={place => this.setState({place})}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Descrição da foto"
          placeholderTextColor="#999"
          onChangeText={description => this.setState({description})}
        />
        
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="hastags"
          placeholderTextColor="#999"
          onChangeText={hashtags => this.setState({hashtags})}
        />

        <TouchableOpacity style={styles.sharetButton} onPress={this.handleSubmit}>
          <Text style={styles.shareButtonText}> Compartilhar </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  selectButton: {
    borderRadius:4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },
  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius:4,
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 15,
  },
  sharetButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff'
  },
});