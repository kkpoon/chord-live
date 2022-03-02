const notes = new Set();

function onMIDIMessage(event) {
  if (event.data.length === 1) {
    return
  }
  const { data } = event;

  // https://fmslogo.sourceforge.io/manual/midi-table.html
  if (![128, 144].includes(data[0])) {
    return;
  }

  const note = Tonal.Midi.midiToNoteName(data[1], { pitchClass: true });

  if (data[0] === 144) {
    notes.add(note);
  } else if (data[0] === 128) {
    notes.delete(note);
  }

  const possibleChords = Tonal.Chord.detect(Array.from(notes));

  if (possibleChords.length !== 0) {
    const [heroChord, ...otherChord] = possibleChords;
    
    document.querySelectorAll(".hero-chord").forEach(el => {
      el.textContent = heroChord;
    });

    document.querySelectorAll(".other-chord").forEach(el => {
      el.textContent = otherChord;
    });
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