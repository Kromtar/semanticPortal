import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../actions'; //TODO: Encapsular

import WordsInterface from './WordsInterface';

class ExpMainBeta extends Component {

  //Cargar dos palabras de la red del usuario (las correspondientes al experimento 1111)

  //Que el usuario pueda relacionar las dos palabras en un campo   A > C < B

  //Analizar la respues y guardar la relacion en la base de datos (correspondiente al experimento 1112)

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  state = {
    errorOnTest: false,             //Identifica si hay un error en la carga del experimento
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount(){
    this._isMounted = true;
    //Comprobamos que el usuario este identificado
    if(!this.props.application.userLogIn){
      this.setState({
        errorOnTest: true
      });
      return;
    }
    //Comprobamos que el usuario ha seleccionado un sala (experimento)
    if(this.props.application.activeExpId === ''){
      this.setState({
        errorOnTest: true
      });
      return;
    }
    this.loadTest();
  }

  componentWillReceiveProps(newProps) {
      //Cuando se termine de cargar el test pedimos cargar las palabras iniciales
      if(newProps.expBeta.testId !== this.props.expBeta.testId){
        this.loadWords(newProps);
      }
   }

  //Incia el test
  async loadTest(){
    //Carga el test del usuario
    const testLoaded = await this.props.loadUserTestBeta({
      experimentId: this.props.application.activeExpId
    }, this.props.user.token);
    if(!testLoaded && this._isMounted){
      this.setState({errorOnTest: true});
      return;
    }
    return;
  }

  //Busca las palabras a preguntar
  async loadWords(newProps){
    await this.props.loadExpBetaWords({
      alphaExpSource: this.props.expBeta.parameters.alphaExpIdSource,
      roomBetaNumber: this.props.forms.roomSelector.room,
    }, this.props.user.token);
  }

  render(){
    //Redireccion en caso de error
    if(this.state.errorOnTest){
      return <Redirect to='/' />
    }

    //Cuando esten cargadas las dos palabras que hay que unir
    if(this.props.expBeta.extremesWords.length >= 2){
      return <WordsInterface />
    }

    return(
      <div>
        Cargando
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    application: state.application,
    user: state.user,
    expBeta: state.expBeta,
    forms: state.forms,
  };
};

export default connect(mapStateToProps, actions)(ExpMainBeta);
