
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../../actions';
import { Redirect } from 'react-router-dom';

import HelpModal from './HelpModal';
import LoadCircle from './LoadCircle';

//TODO: Añadir tiempo maximo sin actividad antes de un cierre
//TODO: que pasa si no se encuentran nuevas palabras al solicitar al dictionary?

class ExpMain extends Component {

  state = {
    helpModal: false,               //Controla si se muestra la ayuda
    progressBarOnHelpModal: false,  //Controla si se muestra una barra de carga en la ayuda
    errorOnTest: false,             //Identifica si hay un error en la carga del experimento
    fristRound: true,               //Indica si la palabra que se despliega es de la primera ronda
    enterLock: false,               //Indica si se estan enviando palabras y hay que bloqear el input
    wordOfRoundCount: 0,            //Cuenta el numero de palabras ingresadas en cada ronda
    nextWordButtonClass: 'waves-effect btn orange lighten-1 disabled',         //Clase del boton
    showLoadCircle: false,          //Controla el circulo de carga
    showNextRoundButton: false,
  }

  componentDidMount(){
    //Comprobamos que el usuario este identificado
    if(!this.props.application.userLogIn){
      this.setState({errorOnTest: true});
    }else{
      //Comprobamos que el usuario seleccionara una sala (experimento)
      if(this.props.application.activeExpId === ''){
        this.setState({errorOnTest: true});
      }else{
        //Iniciamos la carga del experimento
        this.initialLoad();
      }
    }
  }

  async initialLoad(){
    //Despliega las instrucciones e inicia la carga del experimento
    this.setState({helpModal: true, progressBarOnHelpModal: true, fristRound: true});
    const testLoaded = await this.props.loadUserTest({experimentId: this.props.application.activeExpId}, this.props.user.token);
    if(testLoaded){
      //Inicia la carga de la palabra
      const wordLoaded = await this.props.loadNewWord({testId: this.props.expAlpha.testId}, this.props.user.token);
      if(wordLoaded){
        this.setState({progressBarOnHelpModal: false});
      }else {
        console.log('Error al cargar palabra');
        this.setState({errorOnTest: true});
      }
    }else{
      console.log('Error al cargat test');
      this.setState({errorOnTest: true});
    }
  }

  //Controla el cierre de las intrucciones
  onCloseHelpModal(){
    if(this.state.fristRound){
      this.initRound();
      this.setState({fristRound: false});
    }
    this.setState({helpModal: false});
    this.nameInput.focus();
  }

  //Inicia la ronda
  async initRound(){
    var time = new Date();
    const initRound = await this.props.initRound({testId: this.props.expAlpha.testId, word: this.props.expAlpha.actualWord, time: time.toISOString() },this.props.user.token);
    this.setState({wordOfRoundCount: 0});
    if(!initRound){
      this.setState({errorOnTest: true});
    }
  }

  //Manejo de input
  onChangeInput(inputId){
    this.props.formInput({formId:'expA', inputId:inputId, text: $('#'+inputId).val()})
  }

  //Controla en click enter de la persona
  async handleKeyPress(input){
    if(input.key==='Enter' && !this.state.enterLock){
      var time = new Date();
      //Se añade la palabra a la lista
      const wordAddedLimit = this.props.addToWordList(
        {word: this.props.formData.mainInput, time: time.toISOString()},
        this.props.expAlpha.wordInputList.length
      );
      if(wordAddedLimit){
        //TODO: Probar otros metodos para que no se sienta el lag
        //Si la lista ya tiene 10 palabras, se envia
        this.setState({enterLock: true});
        const wordListSaved = await this.props.sendWordList({
          wordList: this.props.expAlpha.wordInputList,
          roundId: this.props.expAlpha.roundId
        },this.props.user.token);
        if(!wordListSaved){
          this.setState({errorOnTest: true});
        }
        //se añade a la lista la ultima palabra que no se pudo enviar
        const wordAddedLimit = this.props.addToWordList(
          {word: this.props.formData.mainInput, time: time.toISOString()},
          this.props.expAlpha.wordInputList.length
        );
        this.setState({enterLock: false});
      }
      this.setState({wordOfRoundCount: this.state.wordOfRoundCount + 1});
      if(this.state.wordOfRoundCount > 2){
        this.setState({nextWordButtonClass: 'waves-effect btn orange lighten-1'});
      }
      this.props.formClear({formId: 'expA'});
      this.nameInput.focus();
    }
  }

  async onClickNextRound(){
    //Se envia la lista que esta pendiente
    //avisar que se termina la ronda correctamente y procesar
    this.setState({
      enterLock: true,
      nextWordButtonClass: 'waves-effect btn orange lighten-1 disabled',
      showLoadCircle: true,
      showNextRoundButton: false,
    });
    const wordListSaved = await this.props.sendWordList({
      wordList: this.props.expAlpha.wordInputList,
      roundId: this.props.expAlpha.roundId
    },this.props.user.token);
    if(!wordListSaved){
      this.setState({errorOnTest: true});
    }
    const roundEnded = await this.props.endRound({
      roundId: this.props.expAlpha.roundId,
      mainWordId: this.props.expAlpha.wordId,
      testId: this.props.expAlpha.testId
    },this.props.user.token);
    if(!roundEnded){
      this.setState({errorOnTest: true});
    }
    const wordLoaded = await this.props.loadNewWord({testId: this.props.expAlpha.testId}, this.props.user.token);
    if(!wordLoaded){
      this.setState({errorOnTest: true});
    }
    this.setState({
      showNextRoundButton: true,
    });
    //TODO:pausa de tiempo T
  }

  //Cuando se cierra la carga entre rondas
  onCloseLoadCircle(){
    this.initRound();
    this.setState({
      showLoadCircle: false,
      enterLock: false
    });
  }

  //TODO: Validar longird de input, que queden en minuscula y sin espacios ni al final ni al inicio
  //TODO: Quitar los acentos para homologar lo mas posible
  render(){

    //Redireccion en caso de error
    if(this.state.errorOnTest){
      return <Redirect to='/' />
    }

    return(

      <div>

        <HelpModal
          onCloseModal={() => this.onCloseHelpModal()}
          isOpen={this.state.helpModal}
          text={this.props.expAlpha.parameters.instructions}
          showProgress={this.state.progressBarOnHelpModal}
          buttonText='Entiendo, quiero comenzar !'
        />

        <LoadCircle
          showNextRoundButton={this.state.showNextRoundButton}
          isOpen={this.state.showLoadCircle}
          onCloseLoadCircle={() => this.onCloseLoadCircle()}
        />

        <div className='row'>
          <div className='col s12 center-align'>
            ¿Que relacionas con la siguiente palabra ?
            <h5>{this.props.expAlpha.actualWord}</h5>
          </div>
        </div>
        <div className='row'>
          <div className='col s6 offset-s3 center-align'>
            <div className="input-field">
              <input
                disabled={this.state.enterLock}
                ref={(input) => { this.nameInput = input; }}
                value={this.props.formData.mainInput}
                onChange={() => this.onChangeInput('mainInput')}
                id="mainInput"
                type="text"
                onKeyPress={(key) => this.handleKeyPress(key)}
              />
            </div>
           Y click en "Enter" para enviar !
          </div>
        </div>
        <div className='row'>
          <div className='col s6 offset-s3 center-align'>
            <div className='col s12 center-align'>
              <a onClick={() => this.onClickNextRound()} className={this.state.nextWordButtonClass}>No se me ocurre nada mas</a>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    application: state.application,
    expAlpha: state.expAlpha,
    user: state.user,
    formData: state.forms.expA,
  };
};

export default connect(mapStateToProps, actions)(ExpMain);
