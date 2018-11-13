import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions'; //TODO: Encapsular

import WordViewer from './wordViewer';

class CacheWordViewer extends Component {

  // Muestra las ultimas 3 palabras (ojo que no puede mostrar mas de 5)
  renderWords(){
    return _.map(this.props.expAlpha.wordInputList.slice(this.props.expAlpha.wordInputList.length - 3 < 0 ? 0 : this.props.expAlpha.wordInputList.length - 3).reverse(), (wordObj, index) => {
      return (
        <WordViewer
          key = {index}
          wordTime = {wordObj.time}
          word = {wordObj.word}
        />
      );
    });
  }

  render(){
    return(
      <div className="row">
        <div className="col s8 offset-s2">
          <div className="card" style={{backgroundColor: "#f7f7f7"}}>
            <div className="card-content">
              <div className="row">
                Lo ultimo que escribiste:
              </div>
              <div className="row noMargin">
                {this.renderWords()}
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
    expAlpha: state.expAlpha,
  };
};

export default connect(mapStateToProps, actions)(CacheWordViewer);
