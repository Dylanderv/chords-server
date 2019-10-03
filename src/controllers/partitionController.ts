import { Partition } from "models/partition";
import { Repository, getManager } from "typeorm";
import { ApolloError } from "apollo-server-koa";

export default class PartitionController {
  public static async getPartitions(): Promise<Partition[]> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    return await partitionRepository.find();
  }

  public static async getPartition(id: string): Promise<Partition> {
    const partitionRepository: Repository<Partition> = getManager().getRepository(Partition);
    try {
      return await partitionRepository.findOneOrFail(id);
    } catch (err) {
      throw new ApolloError("Parition ID not found")
    }
  }
  // TODO PARTITION INPUT
  // public static async modifyPartition(id: string, partitionInput)
}