import React from 'react';
import { createRedux } from 'redux';
import { Provider } from 'redux/react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import * as reducers from '../reducers';
import Builder from './Builder';

const redux = createRedux(reducers);

@DragDropContext(HTML5Backend)
export default class App {
  render() {
    return (
      <Provider redux={redux}>
        {() =>
          <div>
            <Builder />
          </div>
        }
      </Provider>
    );
  }
}
