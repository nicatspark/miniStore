const miniStore = {
  _stateObj: {},
  _callbackObj: {},
  _internalState: {
    initiated: false,
  },
  set INIT(initialState) {
    if (this._internalState.initiated) {
      console.error('The miniStore is already initiated.');
      return;
    }
    this._stateObj = { ...this._stateObj, ...initialState };
    this._internalState.initiated = true;
  },
  get STATE() {
    return this._stateObj;
  },
  set SET(partialState) {
    // Find and store callback functions.
    const isCallback = (key) => /_callback$/.test(key);
    Object.keys(partialState).forEach((key) => {
      if (isCallback(key)) {
        const newKeyValue = {};
        newKeyValue[key] = partialState[key];
        this._callbackObj = { ...this._callbackObj, ...newKeyValue };
      }
    });
    // Update state.
    Object.keys(partialState).forEach((key) => {
      if (!isCallback(key)) {
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
    if (this._callbackObj[`${key}_callback`]) {
      const temp = { ...this._callbackObj };
      delete temp[`${key}_callback`];
      this._callbackObj = temp;
    }
  },
};

export default miniStore;
