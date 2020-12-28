import miniStore from './miniStore.js';

// Initiate.
miniStore.INIT = {
  one: 1,
  two: 2,
  three: 3,
  codeBlock: document.querySelector('pre'),
};

// Add/update state.
miniStore.SET = {
  two: 4,
};

console.log('State initiated and "two" consequently updated:', miniStore.STATE);

// Adds a change callback.
miniStore.SET = {
  two_callback: function ({ oldValue, newValue, historyArray }) {
    const { one, two, three } = miniStore.STATE;
    miniStore.SET = { sum: one + two + three };
    alert('Just updated "two" in miniStore. Check the console.');
    console.log('"two" updated and triggered a alert:', miniStore.STATE);
    console.log('Old and new value of "two":', oldValue, newValue);
    console.log('History of changes for "two":', historyArray);
  },
};

miniStore.SET = {
  two: 2, // will trigger a alert.
};

// Remove callback.
miniStore.REMOVE_CALLBACK = 'two';

// Remove state property (and callback).
miniStore.DELETE = 'two';

console.log('"two" removed:', miniStore.STATE);

// This code loads source code and reveals it in the GUI.
window.onload = () => {
  const { codeBlock } = miniStore.STATE;
  const revealDuration =
    parseInt(
      getComputedStyle(codeBlock).getPropertyValue('--reveal-duration')
    ) * 1000;
  fetch('miniStore.js')
    .then((res) => res.text())
    .then((data) => {
      codeBlock.innerHTML = data;
      codeBlock.classList.add('reveal');
      setTimeout(() => {
        codeBlock.classList.remove('hide-overflow', 'reveal');
      }, revealDuration);
    });
};
