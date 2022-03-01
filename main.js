const notes = new Set();

function onMIDIMessage(event) {
  if (event.data.length > 1) {
    const { data } = event;
    
    if (data[0] !== 128 && data[0] !== 144) {
      return;
    }

    const note = Tonal.Midi.midiToNoteName(data[1], { pitchClass: true });

    if (data[0] === 144) {
      notes.add(note);
    } else if (data[0] === 128) {
      notes.delete(note);
    }

    console.log(Tonal.Chord.detect(Array.from(notes)));
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