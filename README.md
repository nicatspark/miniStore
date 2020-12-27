# miniStore

A pure javascript state engine. A single source of truth with a minimal footprint that features custom callbacks on changes to selected properties.

---

## Get started

####Initiate the store with values.

```
miniStore.INIT = {
  one: 1,
  two: 1,
  three: 1,
}
```

####Read a value from the store.

```const { one } = miniStore.STATE;
// or...
const myValue = miniStore.STATE.two;
```

####Update
The store can be updated with one or multiple key/value pairs in a partial state object.

```
miniStore.SET = {
  two:2,
  three: 3,
};
```

####Add a change callback to a property.
Example code: Every time the 'two' property is updated a function is run that creates/updates a 'sum' property in the state. It could as well do DOM manipulations of course. Note: it's the trailing '\_callback' that indicates that this is indeed a callback function to, in this case, the 'two' property.

```
miniStore.SET = {
  two_callback: function() {
    console.log('Old state:', this._stateObj);
    const {one, two, three} = this._stateObj;
    this._stateObj = {...this._stateObj, sum: one+two+three};
    console.log('New state:', this._stateObj);
  },
}
```

####Remove a callback

```
miniStore.REMOVE_CALLBACK = 'sum';
Delete a property from the store.
miniStore.DELETE = 'sum';
```

---

####Use as a global state manager

```
// change the first line from:
const miniState = { ...
// to:
window.miniState = { ...
```

####Import as a ECMA script module

```
// Copy miniStore source code to its own file. Name it 'miniStore.js'. Add after last line:
export default miniStore;
// Then import where needed:
import miniStore from './miniStore.js';
```
