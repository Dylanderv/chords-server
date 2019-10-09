import { Partition, Visibility } from "../models/Partition";
import { Repository, getManager } from "typeorm";
import { ApolloError, UserInputError } from "apollo-server-koa";
import { PartitionInput } from "../models/partitionInput";
import UserController from "./userController";
import { Chord } from "../models/Chord";
import { ChordController, InstrumentController } from "./instrumentChordController";
import { validate } from "class-validator";

export default class PartitionController {
  public static async getPartitions(): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    return await partitionRepository.find({ relations: ["owner", "chords", "instrument", "instrument.chords"] });
  }

  public static async getPartition(id: string): Promise<Partition> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      return await partitionRepository.findOneOrFail(id, { relations: ["owner", "chords", "instrument", "instrument.chords"] });
    } catch (err) {
      throw new ApolloError("Partition ID not found")
    }
  }

  public static async getPartitionFromUserIdForInstrument(userId: string, instrumentId: string): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      return await partitionRepository
        .createQueryBuilder('partition')
        .where('partition.owner = :userId', {userId})
        .andWhere('partition.instrument = :instrumentId', {instrumentId})
        .leftJoinAndSelect('partition.owner', 'user')
        .leftJoinAndSelect('partition.chords', 'chord')
        .leftJoinAndSelect('partition.instrument', 'instrument')
        .getMany();
    } catch (err) {
      throw new ApolloError("UserId not found")
    }
  }

  public static async createPartition(partitionInput: PartitionInput) {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    const partition = await getPartitionFromPartitionInput(partitionInput, true);
    const error = await validate(partition);
    if (error.length > 0) {
      throw new UserInputError('Validation failed', error);
    } else {
      return await partitionRepository.save(partition);  
    }
  }

  public static async modifyParition(id: string, partitionInput: PartitionInput) {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    let partition: Partition;
    let newPartition: Partition;
    try {
      partition = await PartitionController.getPartition(id);
      newPartition = await getPartitionFromPartitionInput(partitionInput, false);
    } catch (err) {
      throw err;
    }
    partition.chords = newPartition.chords;
    partition.name = newPartition.name;
    partition.visibility = newPartition.visibility;
    partition.content = newPartition.content;
    const error = await validate(partition);
    if (error.length > 0) {
      throw new UserInputError('Validation failed', error);
    } else {
      return await partitionRepository.save(partition);  
    }
  }
}

async function getPartitionFromPartitionInput(partitionInput: PartitionInput, isNew: boolean): Promise<Partition> {
  let partition = new Partition();
  let user = await UserController.getUser(partitionInput.ownerId);
  let listChord: Chord[] = [];
  for (let i = 0; i < partitionInput.chords.length; i++) {
    let chordId = partitionInput.chords[i];
    listChord.push(await ChordController.getChord(chordId));
  }
  partition.chords = listChord;
  console.log(listChord)
  partition.owner = user;
  partition.name = partitionInput.name;
  partition.content = partitionInput.content;
  partition.visibility = Visibility.PUBLIC;
  if (isNew) {
    partition.instrument = await InstrumentController.getInstrument(partitionInput.instrumentId);
  }
  return partition;
}