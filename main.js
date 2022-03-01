function onMIDIMessage(event) {
  if (event.data.length > 1) {
    console.log(event.data);
  }
}

(() => {
  navigator.requestMIDIAccess().then((midi) => {
    console.log("MIDI Ready");
    midi.inputs.forEach((entry) => { entry.onmidimessage = onMIDIMessage; });
  }, (err) => {
    console.error(`Failed to get MIDI access - ${err}`);
  });

})();

console.log(Tonal.Key.minorKey("Ab"));