import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

class HelpModal extends Component {

  static defaultProps = {
    isOpen: false,
    text: 'default test',
    showProgress: false
  };

  onCloseModal(){
    this.props.onCloseModal();
  }

  renderProgressBar(){
    return(
      <div className="progress s6 offset-s3" style={{marginTop: '14px'}}>
        <div className="indeterminate"></div>
      </div>
    );
  }

  renderButton(){
    return(
      <div className='col s12 center-align'>
        <a onClick={() => this.onCloseModal()} className="waves-effect btn light-green darken-4">Entiendo</a>
      </div>
    );
  }

  buttonOrProgress(){
    if(this.props.showProgress){
      return this.renderProgressBar();
    }else{
      return this.renderButton();
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
      >
        <div className="row noMargin">
          <h5>Estas son las instrucciones del ejercicio:</h5>
        </div>
        <div className="row noMargin">
          <div className='col s12'>
            {this.props.text}
          </div>
          {this.buttonOrProgress()}
        </div>
      </Modal>
    );
  }
};

export default HelpModal;
