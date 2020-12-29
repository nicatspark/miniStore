# miniStore

A pure javascript state engine. A single source of truth with a minimal footprint that features custom callbacks on changes to selected properties.

---

## Get started

#### Initiate the store with values.

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

#### Update

The store can be updated with one or multiple key/value pairs in a partial state object.

```
miniStore.SET = {
  two:2,
  three: 3,
};
```

Use it as a mediator for separation of conserns to achieve that freshness of loose couplings. Store your DOM referenses in one place, use in many.

```
miniStore.SET = {
  header: document.querySelector('h1'),
};
// later anywhere...
const { header } = miniStore.STATE;
header.innerHTML = 'Got it!';
```

####Add a change callback to a property.
Example code: Every time the 'two' property is updated a function is run that creates/updates a 'sum' property in the state. It could as well do DOM manipulations of course. Note: it's the trailing '\_callback' that indicates that this is indeed a callback function to, in this case, the 'two' property in the state.

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

Optional default variables available in a callback, oldValue, newValue, historyArray.

```
miniStore.SET = {
  two_callback: function({oldValue, newValue, historyArray}) {
    console.log('Old value of "two" vs new:', oldValue, newValue);
    console.log('Entire history of previous changes to "two":', historyArray);
  },
}
```

#### Remove a callback

```
miniStore.REMOVE_CALLBACK = 'sum';
Delete a property from the store.
miniStore.DELETE = 'sum';
```

---

#### Use as a global state manager (SPA)

For a SPA type application where the window scope is omnipresent. Not 100% if it is a good idea to use it globally on any of the big three (React, Angular or Vue) but why not on any flavor of web component SPA.

```
// change the first line from:
const miniState = { ...
// to:
window.miniState = { ...
```

#### Global state manager on a site despite page loads

If you would want to use it globally on a site that changes url you would have to get creative in the source code with changing the `_stateObj` and `_callbackObj` to recide in sessionStorage for example. My suggestion would be to copy the state to sessionStorage after a change and initiate the state with sessionStorage if it exists. That way the state would be persistent across page loads.

#### And lastly, an important note about 'this' inside callbacks

`this` inside a callback refers to the miniStore internals. Even if shortcuts are possible prefer doing state changes through this.SET,this.REMOVE,this.REMOVE_CALLBACK methods. You can override the default behaviour and bind your callback to another scope with the bind method.

```
const myFunc = function(){console.log(this)};
miniStore.SET = {
  // Whatever `this` refers to when you bind it to the function.
  two_callback: func.bind(this),
}
```

...or why not bind it to the window scope and have access to DOM manipulations on state change events.

```
const myFunc = function(){
  // Bind to 'window' and this makes sense.
  console.log(this.document.querySelector('h1'));
}
miniStore.SET = {
  two_callback: func.bind(window),
}
```

then you have access to `window` and `DOM` inside your callback for example.

By the way, **do not use arrow functions to define your callbacks** since _that_ messes with _this_, get it? :) Happy coding

#### TODOS

##### ~~Expose oldValue / newValue in callbacks~~ Done

The old value in particular is hard to get right now from a callback. It wouldn't be to hard to store the entire old state in an internal array. Primarily to be able to expose oldValue/newValue inside callbacks but it would facilitate for timetravel á la redux style. Although that probably is out of scope for a minimal footprint state manager. Anyway, never heard anyone put the timetravel feature to good use. Tell me if you have. Maybe timetravel on a single property would be a better usercase from a developers point of view actually. Maybe just be able to retreive a full array of all changes to pick from on any property would be usefull.

##### Clean up what this is refering to in callbacks

Instead of exposing all internals try to superimpose the getters/setters (without duplicating code) on the state object and make `this` only point the state object.

##### Fire a javascript change event with a full and updated state attached?

A listener could be set up anywere it made sense in the app and react to specific prop changes. It would make it easier to have a loose coupling, event driven, update situation. Also make it easier to set up a pub/sub pattern. However, I am not a big fan of relying on javascript events because they fail silently and are abstract to work with. In a big application the start upp time for a new developer becomes steeper. This could be somewhat mitigated by being very cautious with the shape of the listener pattern. Not sure if it is a god idea but on the other hand it would take literally just one line of code to implement on the source code side of it I guess.

##### Allow multiple callbacks per property

Make the callback to be an array of functions instead. Have the remove command filter and remove by comparing function to be removed. _(would work similarily to the native javascript add/remove listener)_

##### Create a settings command and default settings

In order to control max size of history and perhaps offer a verbose mode that would show/hide log of what is happening under the hood for dev purpose. A debug mode that outputs the state in a table in the log after state change. Perhaps having a setting for if a callback should be run if the new property is the same as the old one, i.e. no change.
