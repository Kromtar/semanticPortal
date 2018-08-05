import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../../actions'; //TODO: Encapsular
import { Redirect } from 'react-router-dom';

import HelpModal from './HelpModal';              //Modal de ayuda (ocupado como modal inicial)
import EndRoundModal from './EndRoundModal';      //Modal de transicion entre rondas
import CacheWordViewer from './CacheWordViewer';  //Componente para ver ultimas palabras y poder editarlas

//TODO: Añadir tiempo maximo sin actividad antes de un cierre
//TODO: que pasa si no se encuentran nuevas palabras al solicitar al dictionary?
//TODO: Validar longird de input, que queden en minuscula y sin espacios ni al final ni al inicio
//TODO: Quitar los acentos para homologar lo mas posible
//TODO: Validar que no se puedan enviar peticiones en forma simultanea por sobre clicks

//TODO: Quitar boton fantasma para pruebas

class ExpMain extends Component {

  wordInput = React.createRef();

  state = {
    showHelpModal: false,                               //Controla si se muestra el modal de ayuda
    loadingModeHelpModal: true,                         //Controla si se muestra una barra de carga en la ayuda
    textButtonHelpModal: '',                            //Texto en el botton del modal de Ayuda
    timeInitPause: null,                                //Tiempo en que se habre el menu de help
    fristRound: true,                                   //Indica si la palabra que se despliega es de la primera ronda

    showEndRoundModal: false,                     //Controla el modal para siguiente ronda
    showNextRoundButtonEndRoundModal: false,     //Controla si hay que habilitar el boton para siguiente ronda
    showEndExpButtonEndRoundModal: false,        //Muestra boton para finalizar experimento

    errorOnTest: false,             //Identifica si hay un error en la carga del experimento
    enterKeyLocked: false,          //Indica si se estan enviando palabras y hay que bloqear el input
    nextWordButtonClass: 'waves-effect btn orange lighten-1 disabled',         //Clase del boton de proxima ronda
  }

  componentWillMount() {
     //console.info('ExpMain - componentWillMount');
  }

  componentDidMount(){
    //console.info('ExpMain - componentDidMount');

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
    //Iniciamos la carga del experimento
    this.initialLoad();
  }

  //Se ejecuta cuando las props cambian
  //Aqui se pueden ejecutar cambios de state
  componentWillReceiveProps(newProps) {
      //console.info('ExpMain - componentWillReceiveProps');
      //console.info(newProps);
   }

   //shouldComponentUpdate(newProps, newState) {
    //  console.info('ExpMain - shouldComponentUpdate');
   //}

   //Se ejecuta antes del render
   componentWillUpdate(nextProps, nextState) {
      //console.info('ExpMain - componentWillUpdate');
      //console.info('nextProps: ');
      //console.info(nextProps);
      //console.info('nextState: ');
      //console.info(nextState);
   }

   //Se ejecuta luego del render
   componentDidUpdate(prevProps, prevState) {
      if(prevProps.expAlpha.roundId !== this.props.expAlpha.roundId){ //Si se incio una nueva ronda
        this.wordInput.current.focus();
      }
   }

   //Se ejcuta cuando el componente se desmonta
   componentWillUnmount() {
      //console.info('ExpMain - componentWillUnmount');
   }

  //Incia el experimento
  async initialLoad(){
    //Despliega las intrucciones iniciales del experimento
    this.setState({
      showHelpModal: true,
      loadingModeHelpModal: true,
      textButtonHelpModal: 'Entiendo, quiero comenzar !',
      fristRound: true
    });
    //Carga el test del usuario
    const testLoaded = await this.props.loadUserTest({experimentId: this.props.application.activeExpId}, this.props.user.token);
    if(!testLoaded){
      this.setState({errorOnTest: true});
      return;
    }
    //Carga la palabra inicial de la ronda
    const wordLoaded = await this.props.loadNewWord({testId: this.props.expAlpha.testId}, this.props.user.token);
    if(!wordLoaded){
      this.setState({errorOnTest: true});
      return;
    }
    //El modal deja de mostrar el cargador y muestra el boton para iniciar la prueba
    this.setState({
      loadingModeHelpModal: false
    });
    return;
  }

  //Cuando se cierra el modal de ayuda
  async onCloseHelpModal(){
    //En caso de ser el inicio del experimento
    this.setState({showHelpModal: false});
    if(this.state.fristRound){
      this.initRound();
      this.setState({fristRound: false});
    }else{    //En caso de ser una pausa cualquiera
      //Se marca el momento en que termina la pausa y se envia el registro
      var timeEndPause = new Date();
      const pauseSended = await this.props.sendPauseEvent({
        testId: this.props.expAlpha.testId,
        timeInit: this.state.timeInitPause.toISOString(),
        timeEnd: timeEndPause.toISOString()},
      this.props.user.token);
      if(!pauseSended){
        this.setState({errorOnTest: true});
        return;
      }
    }
    this.wordInput.current.focus();
  }

  //Inicia la ronda
  async initRound(){
    var time = new Date();
    const initRound = await this.props.initRound({testId: this.props.expAlpha.testId, word: this.props.expAlpha.actualWord, time: time.toISOString() },this.props.user.token);
    if(!initRound){
      this.setState({errorOnTest: true});
      return;
    }
  }

  //Manejo de input
  onChangeInput(inputId){
    this.props.formInput({formId:'expA', inputId:inputId, text: $('#'+inputId).val()})
  }

  //Click de entrar palabra
  async handleKeyPress(input){
    if(input.key==='Enter' && !this.state.enterKeyLocked){
      this.setState({enterKeyLocked: true});
      var time = new Date();
      //validar y deja en formato palabras
      var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
      var inputValidate = this.props.formData.mainInput.trim();
      for (var i = 0; i < specialChars.length; i++) {
        inputValidate = inputValidate.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
      }
      if(inputValidate === '' || inputValidate.length <= 1){
        this.props.formClear({formId: 'expA'});
        this.setState({enterKeyLocked: false});
        this.wordInput.current.focus();
        return;
      }
      inputValidate = inputValidate.toLowerCase();
      inputValidate = inputValidate.replace(/á/gi,"a");
      inputValidate = inputValidate.replace(/é/gi,"e");
      inputValidate = inputValidate.replace(/í/gi,"i");
      inputValidate = inputValidate.replace(/ó/gi,"o");
      inputValidate = inputValidate.replace(/ú/gi,"u");

      //Se añade la palabra al cache y Añade un contador al numero de palabras de la ronda
      await this.props.addToWordList(
        {word: inputValidate, time: time.toISOString()}
      );
      //Si la lista ya tiene 10 palabras, se envia el cache
      if(this.props.expAlpha.wordInputList.length >= 10){ //TODO: Valor se puede pasar a parametro
        //TODO: Probar otros metodos para que no se sienta el lag
        //Selecciona las primeras 5 palabras del cache y las envia a la DB
        var solicedWordList = this.props.expAlpha.wordInputList.slice(0,5);
        const wordListSaved = await this.props.sendWordList({
          wordList: solicedWordList,
          roundId: this.props.expAlpha.roundId
        },this.props.user.token);
        if(!wordListSaved){
          this.setState({errorOnTest: true});
          return;
        }
        this.setState({enterKeyLocked: false});
      }
      //Muestra el boton para terminar la ronda si se han ingresado 3 palabras o mas esta ronda
      if(this.props.expAlpha.wordOfRoundCount >= 2){ //TODO: Valor se puede pasar a parametro
        this.setState({nextWordButtonClass: 'waves-effect btn orange lighten-1'});
      }
      this.props.formClear({formId: 'expA'});
      this.setState({enterKeyLocked: false});
      this.wordInput.current.focus();
    }
  }

  //Click en proxima ronda
  async onClickNextRound(){
    //Si el usuario completo 2 rondas o mas se da la opcion que salga del experimento
    if(this.props.expAlpha.roundsComplete >= 1){ //TODO: Valor se puede pasar a parametro
      this.setState({
        showEndExpButtonEndRoundModal: true
      });
    }
    this.setState({
      enterKeyLocked: true,
      nextWordButtonClass: 'waves-effect btn orange lighten-1 disabled',
      showEndRoundModal: true,
      showNextRoundButtonEndRoundModal: false,
    });
    //Se envia el cache pendiente
    const wordListSaved = await this.props.sendWordList({
      wordList: this.props.expAlpha.wordInputList,
      roundId: this.props.expAlpha.roundId
    },this.props.user.token);
    if(!wordListSaved){
      this.setState({errorOnTest: true});
      return;
    }
    //Se termina la ronda
    const roundEnded = await this.props.endRound({
      roundId: this.props.expAlpha.roundId,
      mainWordId: this.props.expAlpha.wordId,
      testId: this.props.expAlpha.testId
    },this.props.user.token);
    if(!roundEnded){
      this.setState({errorOnTest: true});
      return;
    }
    //Se carga la nueva palabra raiz
    const wordLoaded = await this.props.loadNewWord({testId: this.props.expAlpha.testId}, this.props.user.token);
    if(!wordLoaded){
      this.setState({errorOnTest: true});
      return;
    }
    this.setState({
      showNextRoundButtonEndRoundModal: true,
    });
  }

  //Cuando se cierra el modal de carga entre rondas
  onCloseEndRoundModal(option){
    switch(option) {
      case 'nextRound':
        this.initRound();
        this.setState({
          showEndRoundModal: false,
          enterKeyLocked: false
        });
        break;
      case 'endExp':
        this.props.userLogOut();
        this.setState({
          endExp: true
        });
        break;
      default:
        this.setState({errorOnTest: true});
    }
  }

  //Cuando el se hace click para pedir ayuda
  onClickHelpButton(){
    var timeInitPause = new Date();
    //Se habre el modal de ayuda y se marca el momento de esto
    this.setState({
      showHelpModal: true,
      loadingModeHelpModal: false,
      textButtonHelpModal: 'Estoy listo para continuar',
      fristRound: false,
      timeInitPause: timeInitPause,
    });
  }

  render(){

    //Redireccion en caso de error
    if(this.state.errorOnTest || this.state.endExp){
      return <Redirect to='/' />
    }

    return(
      <div>

        <HelpModal
          onCloseModal={() => this.onCloseHelpModal()}
          isOpen={this.state.showHelpModal}
          instructionsText={this.props.expAlpha.parameters.instructions}
          loadingMode={this.state.loadingModeHelpModal}
          buttonText={this.state.textButtonHelpModal}
        />

        <EndRoundModal
          showNextRoundButton={this.state.showNextRoundButtonEndRoundModal}
          isOpen={this.state.showEndRoundModal}
          onCloseModal={(option) => this.onCloseEndRoundModal(option)}
          showEndExpButton={this.state.showEndExpButtonEndRoundModal}
        />

        <div className='row' style={{marginTop: '30px'}}>
          <div className='col s12 center-align'>
            ¿Que relacionas con la siguiente palabra ?
            <h5>{this.props.expAlpha.actualWord}</h5>
          </div>
        </div>
        <div className='row'>
          <div className='col s10 l6 offset-s1 offset-l3 center-align'>
            <div className="input-field">
              <input
                disabled={this.state.enterKeyLocked}
                ref={this.wordInput}
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
          <div className='col s12 l6 offset-l3 center-align'>
            <div className='col s6 center-align'>
              <a onClick={() => this.onClickNextRound()} className={this.state.nextWordButtonClass}>Pasar palabra</a>
            </div>
            <div className='col s6 center-align'>
              <a onClick={() => this.onClickHelpButton()} className="waves-effect btn blue">Ver instrucciones</a>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 l6 offset-l3 center-align'>
            <div className='col s12 center-align'>
              <a onClick={() => this.onClickHelpButton()} className="waves-effect btn blue-grey">Pausa</a>
              <a style={{display: 'none'}} onClick={() => this.handleKeyPress({key: 'Enter'})} className="waves-effect btn blue-grey">TEST</a>
            </div>
          </div>
        </div>

              <CacheWordViewer/>

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
