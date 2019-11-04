import React from 'react';
const { createStore, combineReducers, applyMiddleware } = Redux;
const { Provider, connect } = ReactRedux;

const actionNames = { 
  INCREMENT: 'INCREMENT',
  ZERO: 'ZERO',
  DECREMENT: 'DECREMENT',
}
const increment = () => ({
  type: actionNames.INCREMENT,
});
const zero = () => ({
  type: actionNames.ZERO,
});
const decrement = () => ({
  type: actionNames.DECREMENT,
});
const counter = (state = {}, action) => {
  switch (action.type) {
    case actionNames.INCREMENT: {
      return {
        ...state,
        value: state.value + 1,
      };
    }
    case actionNames.ZERO: {
      return {
        ...state,
        value: 0,
      };
    }
    case actionNames.DECREMENT: {
      return {
        ...state,
        value: state.value - 1,
      };
    }
    default: {
      return state;
    }
  }
};

const initialState = localStorage['redux-store']
    ? JSON.parse(localStorage['redux-store'])
    : {
  counter: {
    value: 0,  
  },
};
const logger = store => next => action => {
  let result;
  console.groupCollapsed('dispatching', action.type);
  console.log('prev state', store.getState());
  console.log('action', action);
  result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
const saver = store => next => action => {
  let result = next(action);
  localStorage['redux-store'] = JSON.stringify(store.getState());
  return result;
};
const storeFactory = (initialState = {}) => {
  return applyMiddleware
    (logger, saver) 
    (createStore)
    (combineReducers({ counter }), initialState);
};
const store = storeFactory(initialState);


class App extends React.Component {
	render() {
    console.log(this.props)
    const { counter: { value }, increment, zero, decrement } = this.props;
		return (
			<div>
        <h1>{value}</h1>
        <button onClick={decrement}>-1</button>
        <button onClick={zero}>0</button>
        <button onClick={increment}>+1</button>
			</div>
		);
	}
};


const mapStateToProps = state => ({
  counter: state.counter
});
const mapDispatchToProps = dispatch => ({
  increment(value) {dispatch(increment())},
  zero(value) {dispatch(zero())},
  decrement(value) {dispatch(decrement())},
});
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);


ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
	document.getElementById('app')
);