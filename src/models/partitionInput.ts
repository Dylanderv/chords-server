import { Visibility } from "./Partition"


export class PartitionInput {
  name: string
  chords: string[]
  ownerId: string
  instrumentId: string
  content: string
  visibility: Visibility
}