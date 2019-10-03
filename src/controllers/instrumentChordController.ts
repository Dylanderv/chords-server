import { Instrument } from "../models/Instrument";
import { Repository, getManager } from "typeorm";
import { ApolloError } from "apollo-server-koa";
import { Chord } from "../models/Chord";

export class InstrumentController {
  public static async getInstruments(): Promise<Instrument[]> {
    const instrumentRepository: Repository<Instrument> = getManager().getRepository(Instrument);
    return await instrumentRepository.find({ relations: ["chords"] });
  }

  public static async getInstrument(id: string): Promise<Instrument> {
    const instrumentRepository: Repository<Instrument> = getManager().getRepository(Instrument);
    try {
      return await instrumentRepository.findOneOrFail(id, { relations: ["chords"] });
    } catch(err) {
      throw new ApolloError("Instrument ID not found", "404");
    }
  }
}

export class ChordController {
  public static async getChordForInstrument(instrumentId: string): Promise<Chord[]> {
    const chordRepository: Repository<Chord> = getManager().getRepository(Chord);
    return await chordRepository
      .createQueryBuilder('chord')
      .where('chord.instrument = :instrumentId', {instrumentId})
      .leftJoinAndSelect('chord.instrument', 'instrument')
      .getMany();
  }

  public static async getChord(id: string): Promise<Chord> {
    const chordRepository: Repository<Chord> = getManager().getRepository(Chord);
    try {
      return await chordRepository.findOneOrFail(id, { relations: ["instrument"] });
    } catch(err) {
      throw new ApolloError("Chord ID not found", "404");
    }
  }
}
