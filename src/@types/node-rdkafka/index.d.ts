// Type definitions for node-rdkafka
// Project: event-streamer
// Definitions by: Ezequiel Rabinovich <https://github.com/warseph>

declare module 'node-rdkafka' {

  import { Readable, Writable } from 'stream';

  export class Client extends NodeJS.EventEmitter {
    constructor(globalConf: any, SubClientType: any, topicConf: any);

    connect(metadataOptions: any, cb?: (err: any, data: any) => any): Client;

    getClient(): any;

    connectedTime(): number;

    getLastError(): any;

    isConnected(): boolean;

    disconnect(cb?: (err: any, data: any) => any): Client;

    getMetadata(metadataOptions: any, cb?: (err: any, data: any) => any): any;

    queryWatermarkOffsets(topic: any, partition: any, timeout: any, cb?: (err: any, offsets: any) => any): any;

  }

  export class KafkaConsumer extends Client {
    constructor(conf: any, topicConf: any);

    assign(assignments: any): any;

    assignments(): any;

    commit(topicPartition: any): any;

    commitMessage(msg: any): any;

    commitMessageSync(msg: any): any;

    commitSync(topicPartition: any): any;

    committed(toppars: any, timeout: any, cb: any, ...args: any[]): any;

    consume(number: any, cb: any): void;

    getWatermarkOffsets(topic: any, partition: any): any;

    offsetsStore(topicPartitions: any): any;

    pause(topicPartitions: any): any;

    position(toppars: any): any;

    resume(topicPartitions: any): any;

    seek(toppar: any, timeout: any, cb: any): any;

    setDefaultConsumeTimeout(timeoutMs: any): void;

    subscribe(topics: any): any;

    subscription(): any;

    unassign(): any;

    unsubscribe(): any;

  }

  export class Producer extends Client {
    constructor(conf: any, topicConf: any);

    flush(timeout: any, callback: (error: Error) => any): any;

    poll(): any;

    produce(topic: any, partition: any, message: any, key?: any, timestamp?: any, opaque?: any): any;

    setPollInterval(interval: any): any;

  }

  export const CODES: {
    ERRORS: {
      ERR_BROKER_NOT_AVAILABLE: number;
      ERR_CLUSTER_AUTHORIZATION_FAILED: number;
      ERR_GROUP_AUTHORIZATION_FAILED: number;
      ERR_GROUP_COORDINATOR_NOT_AVAILABLE: number;
      ERR_GROUP_LOAD_IN_PROGRESS: number;
      ERR_ILLEGAL_GENERATION: number;
      ERR_INCONSISTENT_GROUP_PROTOCOL: number;
      ERR_INVALID_COMMIT_OFFSET_SIZE: number;
      ERR_INVALID_GROUP_ID: number;
      ERR_INVALID_MSG: number;
      ERR_INVALID_MSG_SIZE: number;
      ERR_INVALID_REQUIRED_ACKS: number;
      ERR_INVALID_SESSION_TIMEOUT: number;
      ERR_LEADER_NOT_AVAILABLE: number;
      ERR_MSG_SIZE_TOO_LARGE: number;
      ERR_NETWORK_EXCEPTION: number;
      ERR_NOT_COORDINATOR_FOR_GROUP: number;
      ERR_NOT_ENOUGH_REPLICAS: number;
      ERR_NOT_ENOUGH_REPLICAS_AFTER_APPEND: number;
      ERR_NOT_LEADER_FOR_PARTITION: number;
      ERR_NO_ERROR: number;
      ERR_OFFSET_METADATA_TOO_LARGE: number;
      ERR_OFFSET_OUT_OF_RANGE: number;
      ERR_REBALANCE_IN_PROGRESS: number;
      ERR_RECORD_LIST_TOO_LARGE: number;
      ERR_REPLICA_NOT_AVAILABLE: number;
      ERR_REQUEST_TIMED_OUT: number;
      ERR_STALE_CTRL_EPOCH: number;
      ERR_TOPIC_AUTHORIZATION_FAILED: number;
      ERR_TOPIC_EXCEPTION: number;
      ERR_UNKNOWN: number;
      ERR_UNKNOWN_MEMBER_ID: number;
      ERR_UNKNOWN_TOPIC_OR_PART: number;
      ERR__ALL_BROKERS_DOWN: number;
      ERR__ASSIGN_PARTITIONS: number;
      ERR__AUTHENTICATION: number;
      ERR__BAD_COMPRESSION: number;
      ERR__BAD_MSG: number;
      ERR__BEGIN: number;
      ERR__CONFLICT: number;
      ERR__CRIT_SYS_RESOURCE: number;
      ERR__DESTROY: number;
      ERR__END: number;
      ERR__EXISTING_SUBSCRIPTION: number;
      ERR__FAIL: number;
      ERR__FS: number;
      ERR__INVALID_ARG: number;
      ERR__IN_PROGRESS: number;
      ERR__ISR_INSUFF: number;
      ERR__MSG_TIMED_OUT: number;
      ERR__NODE_UPDATE: number;
      ERR__NOT_IMPLEMENTED: number;
      ERR__NO_OFFSET: number;
      ERR__OUTDATED: number;
      ERR__PARTITION_EOF: number;
      ERR__PREV_IN_PROGRESS: number;
      ERR__QUEUE_FULL: number;
      ERR__RESOLVE: number;
      ERR__REVOKE_PARTITIONS: number;
      ERR__SSL: number;
      ERR__STATE: number;
      ERR__TIMED_OUT: number;
      ERR__TIMED_OUT_QUEUE: number;
      ERR__TRANSPORT: number;
      ERR__UNKNOWN_GROUP: number;
      ERR__UNKNOWN_PARTITION: number;
      ERR__UNKNOWN_PROTOCOL: number;
      ERR__UNKNOWN_TOPIC: number;
      ERR__UNSUPPORTED_FEATURE: number;
      ERR__WAIT_CACHE: number;
      ERR__WAIT_COORD: number;
    };
  };

  export const features: string[];

  export const librdkafkaVersion: string;

  export interface ProducerStream extends Writable {
    producer: Producer;
    connect(): void;
    close(cb?: Function): void;
  }

  export interface ConsumerStream extends Readable {
    consumer: KafkaConsumer;
    connect(options: any): void;
    close(cb?: Function): void;
  }

  export interface ConsumerStreamMessage {
    value: Buffer,
    size: number,
    topic: string,
    offset: number,
    partition: number,
    key?: string,
    timestamp?: number
  }

  export function createReadStream(conf: any, topicConf: any, streamOptions: any): ConsumerStream;

  export function createWriteStream(conf: any, topicConf: any, streamOptions: any): ProducerStream;
}
