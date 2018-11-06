import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../actions'; //TODO: Encapsular

import WordsInterface from './WordsInterface';

class ExpMainBeta extends Component {

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

    //En caso que el server no encuentre mas palabras
    if(this.props.expBeta.err === "outofwords"){
      return(
        <div className='row' style={{marginTop: '30px'}}>
          <div className='col s8 offset-s1 flow-text center-align'>
            <b>Fin del experimento</b>
          </div>
        </div>
      );
    }

    //Cuando esten cargadas las dos palabras que hay que unir
    if(this.props.expBeta.extremesWords.length >= 2){

      return(
        <div>
          <div className='row' style={{marginTop: '30px'}}>
            <div className='col s8 offset-s1 flow-text'>
              <p>En esta prueba tienes que relacionar las dos palabras en negrita que están en pantalla. </p>
              <p>Las asaciones libres las puedes realizar rellenando el formulario que este entre las dos palabras en negrita.</p>
              <p><b>Las asociaciones entre las dos palabras son libres</b>, esto quiere decir que puedes ocupar cualquier palabra que se te venga a la mente. Puedes ocupar una o más palabras para relacionar las palabras en negrita. Las palabras llevan un símbolo entremedio para indicar la dirección de la relación. Estos pueden ser:</p>
              <p> "&#60;" la relación va desde la palabra de la derecha a la izquierda</p>
              <p> "&#62;" relación va desde la palabra de la izquierda a la derecha</p>
              <p> "&#61;" la relación puede ir para ambos lados</p>
              <p> Ejemplo: </p>
              <p> <b>piano</b> &#62;teatro&#61; <b>ciudad</b></p>
              <p> <b>perro</b> &#60;veterinario&#60;medicina&#61; <b>doctor</b></p>
            </div>
          </div>
          <div className="divider"></div>
          <WordsInterface />
        </div>
      );
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
