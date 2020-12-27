import miniStore from './miniStore.js';

// Initiate.
miniStore.INIT = {
  one: 1,
  two: 2,
  three: 3,
};

// Add/update state.
miniStore.SET = {
  two: 4,
};

console.log('State initiated and "two" consequently updated:', miniStore.STATE);

// Adds a change callback.
miniStore.SET = {
  two_callback: function () {
    alert('Just updated "two" in miniStore. Check the console.');
    console.log('"Two" updated and triggered a alert:', miniStore.STATE);
  },
};

miniStore.SET = {
  two: 2, // will trigger a alert.
};

// Remove callback.
miniStore.REMOVE_CALLBACK = 'two';

// Remove state property (and callback).
miniStore.DELETE = 'two';

console.log('"Two removed:', miniStore.STATE);
