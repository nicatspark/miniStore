const miniStore = {
  _stateObj: Object.freeze({}),
  _callbackObj: {},
  _internal: {
    initiated: false,
    fatalError: false,
    get state_compromised() {
      if (this.fatalError) {
        throw 'The state is compromised.';
      } else return false;
    },
    isCallback: function (key) {
      return /_callback$/.test(key);
    },
    hasCallbacks: function (state) {
      return !!Object.keys(state).filter((key) => /_callback$/.test(key))
        .length;
    },
  },
  set INIT(initialState) {
    if (this._internal.initiated) {
      console.error('The miniStore is already initiated.');
      this._internal.fatalError = true;
      return;
    }
    if (this._internal.hasCallbacks(initialState)) {
      console.error('Add callbacks separately using SET instead.');
      this._internal.fatalError = true;
      return;
    }
    this._stateObj = { ...this._stateObj, ...initialState };
    this._internal.initiated = true;
  },
  get STATE() {
    if (this._internal.state_compromised) return;
    return this._stateObj;
  },
  set SET(partialState) {
    if (this._internal.state_compromised) return;
    // Find and store callback functions.
    Object.keys(partialState).forEach((key) => {
      if (this._internal.isCallback(key)) {
        const newKeyValue = {};
        newKeyValue[key] = partialState[key];
        this._callbackObj = { ...this._callbackObj, ...newKeyValue };
        // TODO: Add oldValue and newValue to callback function.
      }
    });
    // Update state.
    Object.keys(partialState).forEach((key) => {
      if (!this._internal.isCallback(key)) {
        const newKeyValue = {};
        newKeyValue[key] = partialState[key];
        this._stateObj = Object.freeze({ ...this._stateObj, ...newKeyValue });
        // Check if there is a callback for this change.
        if (this._callbackObj[`${key}_callback`]) {
          console.assert(
            typeof this._callbackObj[`${key}_callback`] !== 'Function',
            'Callback is not a function.'
          );
          this._callbackObj[`${key}_callback`].call(this);
        }
      }
    });
  },
  set DELETE(key) {
    if (this._internal.state_compromised) return;
    if (this._stateObj[key]) {
      const temp = { ...this._stateObj };
      delete temp[key];
      this._stateObj = temp;
    }
    if (this._callbackObj[`${key}_callback`]) {
      const temp = { ...this._callbackObj };
      delete temp[`${key}_callback`];
      this._callbackObj = temp;
    }
  },
  set REMOVE_CALLBACK(key) {
    if (this._internal.state_compromised) return;
    if (this._callbackObj[`${key}_callback`]) {
      const temp = { ...this._callbackObj };
      delete temp[`${key}_callback`];
      this._callbackObj = temp;
    }
  },
};

export default miniStore;
