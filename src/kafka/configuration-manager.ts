import {
  ConsumerGroupStreamOptions, KafkaClientOptions, ProducerOptions
} from 'kafka-node';
import { Configuration } from './interfaces/configuration';
import { ConsumerConfig } from './interfaces/consumer-config';
import { ProducerConfig } from './interfaces/producer-config';

export class ConfigurationManager {
  constructor(
    private config: Configuration,
    public consumerTopics = config.consumer.topics,
    public producerTopic = config.producer.defaultTopic
  ) {}

  get consumerOptions(): ConsumerGroupStreamOptions {
    const get = this.getter(this.config.consumer);
    return {
      autoCommit: false,
      groupId: this.config.consumer.groupId,
      kafkaHost: get('kafkaHost'),
      ssl: get('ssl'),
      sslOptions: get('sslOptions'),
      sasl: get('sasl')
    };
  }

  get kafkaClientOptions(): KafkaClientOptions {
    const get = this.getter(this.config.producer);
    return {
      kafkaHost: get('kafkaHost'),
      sslOptions: get('sslOptions'),
      sasl: get('sasl')
    };
  }
  get producerOptions(): ProducerOptions {
    return {
      partitionerType: 0
    };
  }
  private getter(elem: ConsumerConfig|ProducerConfig) {
    return <T>(property: string): T => elem[property] || this.config.global[property];
  }
}
