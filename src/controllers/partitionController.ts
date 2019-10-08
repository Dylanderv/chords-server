import { Partition, Visibility } from "../models/Partition";
import { Repository, getManager } from "typeorm";
import { ApolloError, UserInputError } from "apollo-server-koa";
import { PartitionInput } from "../models/partitionInput";
import UserController from "./userController";
import { Chord } from "../models/Chord";
import { ChordController } from "./instrumentChordController";
import { validate } from "class-validator";

export default class PartitionController {
  public static async getPartitions(): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    return await partitionRepository.find({ relations: ["owner", "chords", "chords.instrument", "chords.instrument.chords"] });
  }

  public static async getPartition(id: string): Promise<Partition> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      return await partitionRepository.findOneOrFail(id, { relations: ["owner", "chords", "chords.instrument", "chords.instrument.chords"] });
    } catch (err) {
      throw new ApolloError("Partition ID not found")
    }
  }

  public static async createPartition(partitionInput: PartitionInput) {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    const partition = await getPartitionFromPartitionInput(partitionInput);
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
      newPartition = await getPartitionFromPartitionInput(partitionInput);
    } catch (err) {
      throw err;
    }
    partition.chords = partition.chords;
    partition.name = partition.name;
    partition.visibility = partition.visibility;
    const error = await validate(partition);
    if (error.length > 0) {
      throw new UserInputError('Validation failed', error);
    } else {
      return await partitionRepository.save(partition);  
    }
  }
}

async function getPartitionFromPartitionInput(partitionInput: PartitionInput): Promise<Partition> {
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
  partition.visibility = Visibility.PUBLIC;
  return partition;
}