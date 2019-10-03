import { InstrumentController, ChordController } from "../controllers/instrumentChordController"

export const instrumentQuery = {
  async instruments(_, args, ctx) {
    console.log('lasasa')
    return await InstrumentController.getInstruments();
  },

  async instrument(_, args: {id: string}, ctx) {
    return await InstrumentController.getInstrument(args.id);
  }
}

export const chordQuery = {
  async chords(_, args: {instrumentId: string}, ctx) {
    return await ChordController.getChordForInstrument(args.instrumentId);
  },

  async chord(_, args: {id: string}, ctx) {
    return await ChordController.getChordForInstrument(args.id);
  }
}