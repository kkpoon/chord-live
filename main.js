const noteNames = new Set();
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

  const noteName = Tonal.Midi.midiToNoteName(data[1], { pitchClass: true });
  const note = Tonal.Midi.midiToNoteName(data[1]);

  if (data[0] === 144) {
    noteNames.add(noteName);
    notes.add(note);
  } else if (data[0] === 128) {
    noteNames.delete(noteName);
    notes.delete(note);
  }

  const possibleChords = Tonal.Chord.detect(Array.from(noteNames));

  if (possibleChords.length !== 0) {
    const [heroChord, ...otherChord] = possibleChords;

    document.querySelectorAll(".hero-chord").forEach(el => {
      el.textContent = heroChord;
    });

    document.querySelectorAll(".other-chord").forEach(el => {
      el.textContent = otherChord;
    });
  }

  drawScore();
}

function drawScore() {
  const vf = new Vex.Flow.Factory({
    renderer: { elementId: 'score', width: 500, height: 200 },
  });
  
  const score = vf.EasyScore();
  const system = vf.System();
  
  system
    .addStave({
      voices: Array.from(notes).map(n => score.voice(score.notes(`${n}/w`))),
    })
    .addClef('treble');
  
  vf.draw();
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