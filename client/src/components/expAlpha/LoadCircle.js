import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

class LoadCircle extends Component {

  static defaultProps = {
    isOpen: false,
    showNextRoundButton: false,
  };

  onCloseModal(){
    this.props.onCloseLoadCircle();
  }

  renderProgressBar(){
    return(
      <div className="progress s6 offset-s3" style={{marginTop: '14px'}}>
        <div className="indeterminate"></div>
      </div>
    );
  }

  renderButton(){
    if(this.props.showNextRoundButton){
      return(
        <div className='col s12 center-align'>
          <a onClick={() => this.onCloseModal()} className="waves-effect btn light-green darken-4">Estoy listo para la proxima palabra</a>
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
      >
        <div className="row center-align">
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row center-align">
          {this.renderButton()}
        </div>
      </Modal>
    );
  }
};

export default LoadCircle;
