import { getManager } from "typeorm";
import { Instrument } from "../models/Instrument";
import { Chord } from "../models/Chord";

const PianoChord = require('../json/pianoChords.json');
const GuitarChord = require('../json/guitarChords.json');
const UkuleleChord = require('../json/ukuleleChords.json');


export function importChord() {
  importPianoChord();
  importGuitarChord();
  importUkuleleChord();
}

async function importPianoChord() {
  const instrumentRepository = getManager().getRepository(Instrument);
  const chordRepository = getManager().getRepository(Chord);
  let piano = new Instrument();
  console.log(PianoChord);
  piano.name = PianoChord.main.name;
  piano.keys = PianoChord.keys;
  piano.suffixes = PianoChord.suffixes;
  await instrumentRepository.save(piano);

  // let chordList: Chord[] = []
  Object.getOwnPropertyNames(PianoChord.chords).forEach(prop => {
    PianoChord.chords[prop].forEach(chord => {
      let currChord = new Chord();
      console.log(chord);
      currChord.key = chord.key;
      currChord.suffix = chord.suffix;
      currChord.position = JSON.stringify(chord.position);
      currChord.instrument = piano;
      // chordList.push(currChord);
      chordRepository.save(currChord);
    })
  })
  // piano.chords = chordList;

}

async function importGuitarChord() {
  const instrumentRepository = getManager().getRepository(Instrument);
  const chordRepository = getManager().getRepository(Chord);
  let guitar = new Instrument();
  guitar.name = GuitarChord.main.name;
  guitar.keys = GuitarChord.keys;
  guitar.suffixes = GuitarChord.suffixes;
  guitar.infos = JSON.stringify(GuitarChord.main);
  await instrumentRepository.save(guitar);

  // let chordList: Chord[] = []
  Object.getOwnPropertyNames(GuitarChord.chords).forEach(prop => {
    GuitarChord.chords[prop].forEach(async (chord) => {
      let currChord = new Chord();
      // console.log(chord);
      currChord.key = chord.key;
      currChord.suffix = chord.suffix;
      currChord.position = JSON.stringify(chord.positions);
      currChord.instrument = guitar;
      // chordList.push(currChord);
      await chordRepository.save(currChord);
    })
  })
  // guitar.chords = chordList;
  
}

async function importUkuleleChord() {
  const instrumentRepository = getManager().getRepository(Instrument);
  const chordRepository = getManager().getRepository(Chord);
  let ukulele = new Instrument();
  ukulele.name = UkuleleChord.main.name;
  ukulele.keys = UkuleleChord.keys;
  ukulele.suffixes = UkuleleChord.suffixes;
  ukulele.infos = JSON.stringify(UkuleleChord.main)
  await instrumentRepository.save(ukulele);
  // let chordList: Chord[] = []
  Object.getOwnPropertyNames(UkuleleChord.chords).forEach(prop => {
    UkuleleChord.chords[prop].forEach(chord => {
      let currChord = new Chord();
      currChord.key = chord.key;
      currChord.suffix = chord.suffix;
      currChord.position = JSON.stringify(chord.positions);
      currChord.instrument = ukulele;
      // chordList.push(currChord);
      chordRepository.save(currChord);
    })
  })
  // ukulele.chords = chordList;
}
