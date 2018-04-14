import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../actions';

import NewAccountModal from './NewAccountModal';

//TODO: Se podria manejar las form con states de cl clase

class Login extends Component {

  //TODO: ERROR AL INGRESAR CKAVE Y 2 VECES RUT CON COLOR switch. Actualizar el metodo para validar

  state = {
    rutInputClassName: 'validate',
    passwordInputClassName: 'validate',
    showProgressBar: false
  }

  onChangeInput(inputId){
    this.props.formInput({formId:'login', inputId:inputId, text: $('#'+inputId).val()})
  }

  formatAndValidateRut(rut){
    var valor = rut.replace('.','');
    valor = valor.replace('-','');
    var cuerpo = valor.slice(0,-1);
    var dv = valor.slice(-1).toUpperCase();
    rut = cuerpo + '-'+ dv
    if(cuerpo.length < 7) {
      this.props.formError({formId:'login', err:'Rut no valido'});
      this.setState({rutInputClassName: 'validate invalid'});
      //this.props.formInput({formId:'login', inputId:'rut', text: ''});
      return 0;
    }
    var suma = 0;
    var multiplo = 2;
    for(var i=1;i<=cuerpo.length;i++) {
        var index = multiplo * valor.charAt(cuerpo.length - i);
        suma = suma + index;
        if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }
    var dvEsperado = 11 - (suma % 11);
    dv = (dv == 'K')?10:dv;
    dv = (dv == 0)?11:dv;
    if(dvEsperado != dv) {
      this.props.formError({formId:'login', err:'Rut no valido'});
      this.setState({rutInputClassName: 'validate invalid'});
      //this.props.formInput({formId:'login', inputId:'rut', text: ''});
      return 0;
    }
    if(rut !== 0){
      this.setState({rutInputClassName: 'validate valid'});
    }
    return rut;
  }

  async onClickLogin(){
    var allOK = true;
    allOK = this.validateExistenceAndLength(this.props.formData.rut, 'rutInputClassName' , 32);
    allOK = this.validateExistenceAndLength(this.props.formData.password, 'passwordInputClassName' , 32);
    if(allOK){
      const rut = this.formatAndValidateRut(this.props.formData.rut); //Return 0 -> invalid Rut //Return formated Rut --> valid Rut
      if(rut !== 0){
        this.props.formError({formId:'login', err:''});
        const credentials = {rut: rut, password:this.props.formData.password};
        this.setState({showProgressBar: true});
        await this.props.loginUser(credentials);
        this.setState({showProgressBar: false});
        //TODO: Redireccion de path ¿aqui o en la action ?
        console.log(this.props.userData);
      }
    }
  }

  validateExistenceAndLength(formData, errStateVarName, maxLength){
    if(formData === '' || formData.length > maxLength){
      this.setState({[errStateVarName]: 'validate invalid'});
      return false;
    }else{
      this.setState({[errStateVarName]: 'validate valid'});
      return true;
    }
  }

  renderProsgressBar(){
    if(this.state.showProgressBar){
      return (
        <div className="progress s6 offset-s3" style={{marginTop: '14px'}}>
          <div className="indeterminate"></div>
        </div>
      );
    }else{
      return (
        <div className="row noMargin" style={{marginTop: '24px'}}>
          <div className='col s6 center-align'>
            <a
              onClick={() => {
                this.props.formClear({formId: 'login'});
                this.props.modalControl({modalId: 'newAccount', state: true})
              }}
              className="waves-effect btn-flat blue-grey lighten-2">
              Crear cuenta
            </a>
          </div>
          <div className='col s6 center-align'>
            <a onClick={() => this.onClickLogin()} className="waves-effect btn light-green darken-4">Entrar</a>
          </div>
        </div>
      );
    }
  }

  renderErr(){
    if(this.props.formData.err !== ''){
      return (
        <div className='col s12 center-align'>
          {this.props.formData.err}
        </div>
      );
    }else{
      return (
        <div/>
      );
    }
  }

  render(){
    return(
      <div>

        <NewAccountModal />

        <div className='row'>
          <div className='col s6 offset-s3 center-align'>
            Titulo del proyecto
          </div>
        </div>
        <div className='row'>
          <div className='col s6 offset-s3'>
            <div className="card">
              <div className="card-content">

                <div className="input-field">
                  <input value={this.props.formData.rut} onChange={() => this.onChangeInput('rut')} placeholder="12345678-9" id="rut" type="text" className={this.state.rutInputClassName}/>
                  <label htmlFor="rut">Rut</label>
                </div>

                <div className="input-field">
                  <input  value={this.props.formData.password} onChange={() => this.onChangeInput('password')} id="password" type="password" className={this.state.passwordInputClassName}/>
                  <label htmlFor="password">Contraseña</label>
                </div>

                {this.renderErr()}

                <div className="divider"/>

                {this.renderProsgressBar()}

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    formData: state.forms.login,
    userData: state.user,
  };
};

export default connect(mapStateToProps, actions)(Login);
