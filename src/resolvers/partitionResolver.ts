import { PartitionInput } from "../models/partitionInput"
import PartitionController from "../controllers/partitionController"
import { Visibility } from "../models/Partition";
import { ApolloError } from "apollo-server-koa";

export const partitionQuery = {
  async partitions(_, args, ctx) {
    return await PartitionController.getPartitions();
  },

  async partition(_, args: {id: string}, ctx) {
    let partition = await PartitionController.getPartition(args.id);
    if (partition.visibility === Visibility.PRIVATE ) {
      if (ctx.state.user && ctx.state.user.id && ctx.state.user.id === partition.owner.id) {
        return partition
      } else {
        throw new ApolloError('Unauthorized', "403");
      }
    } else {
      return partition
    }
  }
}

export const partitionMutation = {
  async createPartition(_, args: {partitionInput: PartitionInput}, ctx) {
    if (ctx.state.user && ctx.state.user.id && ctx.state.user.id === args.partitionInput.ownerId) {
      return await PartitionController.createPartition(args.partitionInput);
    }
  },
  async modifyPartition(_, args: {id: string, partitionInput: PartitionInput}, ctx) {
    if (ctx.state.user && ctx.state.user.id && ctx.state.user.id === args.partitionInput.ownerId) {
      return await PartitionController.modifyParition(args.id, args.partitionInput);
    }
  }
}
