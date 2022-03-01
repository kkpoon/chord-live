function onMIDIMessage(event) {
  console.log(event);
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