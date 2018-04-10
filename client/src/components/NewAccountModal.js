import React, { Component } from 'react';
import { connect } from 'react-redux';
//import $ from 'jquery';
import * as actions from '../actions';
import Modal from 'react-responsive-modal';

class NewAccountModal extends Component {

  onCloseModal(){
    //limpiar los formularios
    this.props.modalControl({modalId: 'newAccount', state: false});
  }

  render(){
    return(
      <div>
        <Modal
          open={this.props.modalState}
          //showCloseIcon={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
          onClose={() => this.onCloseModal()}
        >
          <div className="row">
            Titulo
          </div>
          <div className="row">
            <div className="col s12">
              <div className="input-field">
                <input id="name" type="text" className="validate"/>
                <label htmlFor="name">¿Cual es tu nombre?</label>
              </div>
              <div className="input-field">
                <input id="surname" type="text" className="validate"/>
                <label htmlFor="surname">¿Cual es tu apellido?</label>
              </div>
              <div className="input-field">
                <input id="newRut" type="text" className="validate"/>
                <label htmlFor="newRut">¿Cual es tu Rut?</label>
              </div>
              <div className="input-field">
                <input id="mail" type="text" className="validate"/>
                <label htmlFor="mail">¿Cual es tu Mail?</label>
              </div>
              <div className="input-field">
                <input id="age" type="text" className="validate"/>
                <label htmlFor="age">¿Cual es tu Edad?</label>
              </div>
              <div className="input-field">
                <input id="newPassword" type="text" className="validate"/>
                <label htmlFor="newPassword">Crea tu contraseña</label>
              </div>
              <div className="input-field">
                <input id="newPasswordVer" type="text" className="validate"/>
                <label htmlFor="newPasswordVer">Repite tu contraseña</label>
              </div>
              COSAS DE INTERES
              SEXO
            </div>
          </div>
          <div className="row">
            Botones
          </div>
        </Modal>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    modalState: state.application.modals.newAccount,
  };
};

export default connect(mapStateToProps, actions)(NewAccountModal);
