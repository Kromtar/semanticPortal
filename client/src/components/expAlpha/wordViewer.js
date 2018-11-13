import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../../actions'; //TODO: Encapsular

class wordViewer extends Component {

  fixWordInput = React.createRef();

  state = {
    word: this.props.word,
    editMode: false,
    wordTime: this.props.wordTime,
  }

  //Se ejecuta cuando se cambian las propiedades del objeto
  //Si se cambian las propiedades por el que instancio, se resetea todo
  componentWillReceiveProps(newProps){
     this.setState({
       word: newProps.word,
       editMode: false,
       wordTime: newProps.wordTime,
     });
  }

  //Se ejecuta luago de cada render
  componentDidUpdate() {
    //Si el componente esta montado
    if(this.fixWordInput.current !== null){
      //focus por referencia
      this.fixWordInput.current.focus();
    }
  };

  onClickCorrect(){
    this.setState({editMode: true});
  }

  async onClickEnd(){
    this.setState({editMode: false});
    await this.props.editWordInCache({
      word: this.state.word,
      time: this.state.wordTime, //enviamos el tiempo en que la palabra es dicto para poder buscarla en el cache y editar
    });
  }

  onChangeInput(){
    this.setState({
      word: this.fixWordInput.current.value
    });
  }

  renderButton(){
    if(!this.state.editMode){
      return (
        <a onClick={() => this.onClickCorrect()} className="waves-effect btn pink lighten-3">Corregir</a>
      );
    }else {
      return (
        <a onClick={() => this.onClickEnd()} className="waves-effect btn green">Terminar</a>
      );
    }
  }

  renderWord(){
    if(!this.state.editMode){
      return (
        <div style={{marginTop: '12px', fontWeight: 'bold'}}>
          {this.state.word}
        </div>
      );
    }else{
      return (
        <div className="input-field" style={{marginTop: '0px'}}>
          <input
            style={{marginBottom: '0px'}}
            onChange={() => this.onChangeInput()}
            value={this.state.word}
            id="fixWordInput"
            type="text"
            ref={this.fixWordInput}
          />
        </div>
      );
    }
  }

  render(){
    return (
      <div className='row noMargin' style={{paddingTop: '3px'}}>
        <div className='col s6 right-align'>
          {this.renderWord()}
        </div>
        <div className='col s6 left-align' style={{marginTop: '5px'}}>
          {this.renderButton()}
        </div>
      </div>
    );
  }

};

function mapStateToProps(state){
  return {
  };
};

export default connect(mapStateToProps, actions)(wordViewer);
