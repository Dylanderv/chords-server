import { PartitionInput } from "../models/partitionInput"
import PartitionController from "../controllers/partitionController"
import { Visibility, Partition } from "../models/Partition";
import { ApolloError } from "apollo-server-koa";

export const partitionQuery = {
  async partitions(_, args, ctx) {
    if (ctx.state.user && ctx.state.user.id) {
      return await PartitionController.getPartitions(ctx.state.user.id);
    } else {
      return await PartitionController.getPartitions(undefined);
    }
  },

  async partition(_, args: {id: string}, ctx) {
    let partition;
    if (ctx.state.user && ctx.state.user.id) {
      partition = await PartitionController.getPartition(args.id, ctx.state.user.id);
    } else {
      partition = await PartitionController.getPartition(args.id, undefined);
    }
    if (partition.visibility === Visibility.PRIVATE ) {
      if (ctx.state.user && ctx.state.user.id && ctx.state.user.id === partition.owner.id) {
        return partition
      } else {
        throw new ApolloError('Unauthorized', "403");
      }
    } else {
      return partition
    }
  },

  async partitionsFromUserForInstrument(_, args: {userId: string, instrumentId: string}, ctx) {
    if (ctx.state.user && ctx.state.user.id) {
      return PartitionController.getPartitionFromUserIdForInstrument(args.userId, args.instrumentId, ctx.state.user.id);
    } else {
      return PartitionController.getPartitionFromUserIdForInstrument(args.userId, args.instrumentId, undefined);
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
    let partition: Partition;
    try {
      if (ctx.state.user && ctx.state.user.id) {
        partition = await PartitionController.getPartition(args.id, ctx.state.user.id);
      } else {
        partition = await PartitionController.getPartition(args.id, undefined);
      }
    } catch (err) {
      throw new ApolloError('Not found', '404');
    }
    if (
      ctx.state.user && ctx.state.user.id && ctx.state.user.id === partition.owner.id 
      && ctx.state.user.id === args.partitionInput.ownerId
    ) {
      return await PartitionController.modifyParition(args.id, args.partitionInput, ctx.state.user.id);
    } else {
      throw new ApolloError('Unauthorized', "403");
    }
  },
  async deletePartition(_, args: {id: string}, ctx) {
    if (ctx.state.user && ctx.state.user.id) {
      let partition: Partition;
      try {
        partition = await PartitionController.getPartition(args.id, ctx.state.user.id);
      } catch (err) {
        throw new ApolloError('Not found', '404');
      }
      if (ctx.state.user.id === partition.owner.id) {
        return await PartitionController.deletePartition(args.id);
      }
    } else {
      throw new ApolloError('Unauthorized');
    }
  }
}
