import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../actions';

class Login extends Component {

  state = {
    rutInputClassName: 'validate',
    passwordInputClassName: 'validate',
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
    if(cuerpo.length < 7) { return 0;}
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
    if(dvEsperado != dv) { return 0; }
    return rut;
  }

  onClickLogin(){
    var rut = this.formatAndValidateRut(this.props.formData.rut);
    if(rut === 0){
      this.props.formError({formId:'login', err:'Rut no valido'});
      this.setState({rutInputClassName: 'validate invalid'});
    }else{
      this.props.formError({formId:'login', err:''});
      this.setState({rutInputClassName: 'validate valid'});

      const credentials = {rut: rut, pass:this.props.formData.password};
      this.props.loginUser(credentials);
      //esperar login
      //desplega errores
      //redirigir
    }
  }

  render(){

    return(
      <div>
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

                <div className="divider"/>

                <div className="row noMargin" style={{marginTop: '24px'}}>
                  <div className='col s6 center-align'>
                    <a className="waves-effect btn-flat blue-grey lighten-2">Crear cuenta</a>
                  </div>
                  <div className='col s6 center-align'>
                    <a onClick={() => this.onClickLogin()} className="waves-effect btn light-green darken-4">Entrar</a>
                  </div>
                </div>

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
    formData: state.forms.login
  };
};

export default connect(mapStateToProps, actions)(Login);
