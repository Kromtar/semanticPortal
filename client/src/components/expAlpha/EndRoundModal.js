import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

class EndRoundModal extends Component {

  static defaultProps = {
    isOpen: false,
    showNextRoundButton: false,
    showEndExpButton: false
  };

  onCloseModal(option){
    this.props.onCloseModal(option);
  }

  renderContent(){
    var content = [];
    if(this.props.showNextRoundButton){
      content.push(
        <div key={1}>
          <a onClick={() => this.onCloseModal('nextRound')} className="waves-effect btn light-green darken-4">Estoy listo para la proxima palabra</a>
        </div>
      );
      if(this.props.showEndExpButton){
        content.push(
          <div key={1} style={{marginTop: '20px'}}>
            <a onClick={() => this.onCloseModal('endExp')} className="waves-effect btn red darken-4">Quiero terminar por hoy</a>
          </div>
        );
      }
    }
    if(content.length > 0){
      return(
        <div className="col s12 center-align noMargin">
          {content}
        </div>
      );
    }
    return(
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
    );
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
          {this.renderContent()}
        </div>
      </Modal>
    );
  }
};

export default EndRoundModal;
