import { Partition, Visibility } from "../models/Partition";
import { Repository, getManager } from "typeorm";
import { ApolloError, UserInputError } from "apollo-server-koa";
import { PartitionInput } from "../models/partitionInput";
import UserController from "./userController";
import { Chord } from "../models/Chord";
import { ChordController, InstrumentController } from "./instrumentChordController";
import { validate } from "class-validator";
import { User } from "models/user";

export default class PartitionController {
  public static async getPartitions(currentUserId: string|undefined): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    // let partitions = await partitionRepository.find({ relations: ["owner", "chords", "instrument", "instrument.chords"] });
    return await partitionRepository
      .createQueryBuilder('partition')
      .where('partition.visibility = :publicVisibility', {publicVisibility: Visibility.PUBLIC})
      .orWhere('partition.owner = :currentUserId', {currentUserId})
      .leftJoinAndSelect('partition.owner', 'user')
      .leftJoinAndSelect('partition.chords', 'chord')
      .leftJoinAndSelect('partition.instrument', 'instrument')
      .getMany();
  }

  public static async getPartition(id: string, currentUserId: string|undefined): Promise<Partition> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    let partition: Partition;
    try {
      partition = await partitionRepository.findOneOrFail(id, { relations: ["owner", "chords", "instrument", "instrument.chords"] });
      if (partition.visibility === Visibility.PRIVATE && partition.owner.id !== currentUserId) {
        throw new ApolloError("Unauthorized");
      } else {
        return partition;
      }
    } catch (err) {
      throw new ApolloError("Partition ID not found")
    }
  }

  public static async getPartitionFromUserIdForInstrument(userId: string, instrumentId: string, currentUserId: string|undefined): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      let partitions = await partitionRepository
        .createQueryBuilder('partition')
        .where('partition.owner = :userId', {userId})
        .andWhere('partition.instrument = :instrumentId', {instrumentId})
        .leftJoinAndSelect('partition.owner', 'user')
        .leftJoinAndSelect('partition.chords', 'chord')
        .leftJoinAndSelect('partition.instrument', 'instrument')
        .getMany();
      if (currentUserId !== undefined) {
        return partitions.filter(partition => (partition.visibility === Visibility.PUBLIC) || (partition.owner.id === currentUserId))
      } else {
        return partitions.filter(partition => partition.visibility === Visibility.PUBLIC)
      }
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

  public static async modifyParition(id: string, partitionInput: PartitionInput, currentUserId: string) {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    let partition: Partition;
    let newPartition: Partition;
    try {
      partition = await PartitionController.getPartition(id, currentUserId);
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

  public static async deletePartition(id: string) {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      await partitionRepository.delete(id);
    } catch (err) {
      throw new ApolloError('Error when deleting');
    }
    return id;
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
  partition.visibility = partitionInput.visibility;
  if (isNew) {
    partition.instrument = await InstrumentController.getInstrument(partitionInput.instrumentId);
  }
  return partition;
}