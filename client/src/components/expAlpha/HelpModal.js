import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

class HelpModal extends Component {

  static defaultProps = {
    isOpen: false,
    instructionsText: 'default test', //TODO: NO se estan ocupando las instrucciones desde DB
    loadingMode: false,
    buttonText: 'salir',
  };

  state = {
    page: 1,
  }

  onCloseModal(){
    this.props.onCloseModal();
  }

  onClickNextButton(){
    this.setState({page: this.state.page + 1});
  }

  renderProgressBar(){
    return(
      <div className="progress s6 offset-s3" style={{marginTop: '14px'}}>
        <div className="indeterminate"></div>
      </div>
    );
  }

  rederNextButton(){
    return(
      <div key={3} className='col s12 center-align'>
        <a onClick={() => this.onClickNextButton()} className="waves-effect btn light-green darken-4">Realizar experimento</a>
      </div>
    );
  }


  renderButton(){
    return(
      <div key={4} className='col s12 center-align'>
        <a onClick={() => this.onCloseModal()} className="waves-effect btn light-green darken-4">{this.props.buttonText}</a>
      </div>
    );
  }

  renderContent(page){
    var content = [];
    if(this.props.loadingMode){
      return this.renderProgressBar();
    }else{
      if(page===1){
        content.push(
          <div key={1} className="col s12 flow-text">
            <p><b>¿En qué consiste este experimento?</b></p>
            <p>Este experimento consiste en recolectar todas las <b>asociaciones libres</b> que se le ocurran al leer una determinada palabra.</p>
            <p>Una asociación libre es cualquier concepto o idea que se le venga a la cabeza espontáneamente al leer la palabra. Por ejemplo, las asociaciones libres de la palabra PASTO son <b>todas las respuestas que se le ocurren a la pregunta</b> ¿Qué ideas se te vienen al cabeza con la palabra PASTO?</p>
            <p>Ejemplo: Tus asociaciones libres de la palabra PASTO podrían ser: JARDÍN, VERDE, CAMPO…. Y muchas más claro !</p>
            <p>Dependiendo de la palabra, a uno se le pueden ocurrir pocas o muchas asociaciones libres. El objetivo en este experimento es que <b>escriba todas las asociaciones libres</b> que espontáneamente se le ocurran, sin límite de tiempo.</p>
          </div>
        );
        content.push(this.rederNextButton());
      }
      if(page===2){
        content.push(
          <div key={2} className="col s12 flow-text">
            <p><b>¿Cómo uso el sistema?</b></p>
            <p>A continuación el sistema le mostrará una palabra y una casilla para escribir. En esa casilla escriba por favor su primera asociación libre y luego presione la telca "ENTER" de su teclado. Al presionar la tecla "ENTER", su asociación libre será guardada y aparecerá la casilla vacía para que ingrese la siguiente asociación. </p>
            <p>Cuando ya no se le ocurran más asociaciones libres, presione el botón "ESTOY SIN IDEAS" y luego en "PRÓXIMA PALABRA" para pasar a la siguiente palabra.</p>
            <p>Cuando ya se encuentre cansad@ de ingresar asociaciones y desee terminar la sesión de hoy, por favor presione "ESTOY SIN IDEAS" y luego "TERMINAR POR AHORA"</p>
            <p>Muchas gracias por su participación en este experimento</p>
          </div>
        );
        content.push(this.renderButton());
      }

      return (
        <div>
          {content}
        </div>
      );
    }
  }
  render(){
    return(
      <Modal
        open={this.props.isOpen}
        showCloseIcon={false}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={() => this.onCloseModal()}
        onExited={() => this.setState({page: 1})}
      >
        <div className="row noMargin">
          {this.renderContent(this.state.page)}
        </div>
      </Modal>
    );
  }
};

export default HelpModal;
