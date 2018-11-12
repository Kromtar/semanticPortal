import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

class WordsInterface extends Component {

  input = React.createRef();

  state = {
    input: '',
    inputClassName: 'validate',
    lockButton: false
  }

  componentDidMount(){
    this.input.current.focus();
  }

  //Manejo de input
  onChangeInput(inputId){
    this.setState({
      input: this[inputId].current.value
    });
  }

  //Click en boton listo
  async onClickReady(){
    var relations = this.processString(
      this.state.input,
      this.props.expBeta.extremesWords[0].word,
      this.props.expBeta.extremesWords[1].word
    );
    if(relations === -1){
      this.setState({
        inputClassName: 'invalid',
      });
    }else{
      this.setState({
        inputClassName: 'validate',
        lockButton: true,
      });

      //HAY QUE DEJAR EN MINISCULA Y PROCESAR ACENTOS Y OTROS (ESPACIOSs)

      const allOK = await this.props.sendRelationWords(
        {
          testId: this.props.expBeta.testId,
          roomBetaNumber: this.props.forms.roomSelector.room,
          alphaExpSource: this.props.expBeta.parameters.alphaExpIdSource,
          relations
        },
        this.props.user.token
      );
      if(!allOK){
        console.log("Error al enviar relaciones");
      }
      this.setState({
        lockButton: false,
        input: '',
      });
      this.input.current.focus();
    }
  }

  //Procesador de string
  processString(inputString,initWord,endWord){
    var wordsArray = [];
    var conectionArray = [];
    var output = [];
    var err = false;

    //Elimina los espacios
    inputString = inputString.replace(/ /g,"");
    //Dejamos en minuscula
    inputString = inputString.toLowerCase();
    //Removemos acentos
    inputString = inputString.replace(/á/gi,"a");
    inputString = inputString.replace(/é/gi,"e");
    inputString = inputString.replace(/í/gi,"i");
    inputString = inputString.replace(/ó/gi,"o");
    inputString = inputString.replace(/ú/gi,"u");

    //Verifica que el primer y ultimo caracter sean simbolos de conexion
    if(inputString[0] !== "<" && inputString[0] !== ">" && inputString[0] !== "=") return -1
    if(inputString[inputString.length - 1] !== "<" && inputString[inputString.length - 1] !== ">" && inputString[inputString.length - 1] !== "=") return -1

    wordsArray = inputString.split(/<|>|=/);
    wordsArray = wordsArray.slice(1,wordsArray.length - 1);

    //Verifica que no existan dos simbolos contiguos
    for (var wordIndex = 0; wordIndex < wordsArray.length; wordIndex++){
      if(wordsArray[wordIndex].length <= 1) return -1;
    }

    if(wordsArray.length === 0) return -1;

    for (var charIndex = 0; charIndex < inputString.length; charIndex++) {
      if(inputString.charAt(charIndex) === "<") conectionArray.push("<");
      if(inputString.charAt(charIndex) === ">") conectionArray.push(">");
      if(inputString.charAt(charIndex) === "=") conectionArray.push("=");
    }

    createRelation(initWord, wordsArray[0], conectionArray[0]);
    for(var wordIndex = 0; wordIndex < wordsArray.length - 1; wordIndex++){
      createRelation(wordsArray[wordIndex], wordsArray[wordIndex+1], conectionArray[wordIndex+1]);
    }
    createRelation(wordsArray[wordsArray.length - 1], endWord, conectionArray[wordsArray.length]);

    return output;

    function createRelation(wordFrom, wordTo, relation){
      output.push({wordFrom,wordTo,relation});
    }
  }


  render(){
    return(
      <div className='row' style={{marginTop: '30px'}}>
        <div className='col s4 center-align'>
          <b style={{fontSize: 'xx-large'}}>{this.props.expBeta.extremesWords[0].word}</b>
        </div>
        <div className='col s4 center-align'>
          <input
            ref={this.input}
            value={this.state.input}
            onChange={() => this.onChangeInput('input')}
            type="text"
            className={this.state.inputClassName}
          />
        </div>
        <div className='col s4 center-align'>
          <b style={{fontSize: 'xx-large'}}>{this.props.expBeta.extremesWords[1].word}</b>
        </div>
        <div className='col s12 center-align'>
          <a
           onClick={() => this.onClickReady()}
           className="waves-effect btn blue-grey"
           disabled={this.state.lockButton}
          >
            Listo
          </a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    expBeta: state.expBeta,
    user: state.user,
    expBeta: state.expBeta,
    forms: state.forms,
  };
};

export default connect(mapStateToProps, actions)(WordsInterface);
