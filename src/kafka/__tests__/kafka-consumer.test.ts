import kafkaNode = require('../../__mocks__/kafka-node');
import { EventConsumer } from '../event-consumer';
import { testRouter } from '../../test/factories/test-router';
import { testMessage } from '../../test/factories/test-message';
import { testInvalidMessage } from '../../test/factories/test-invalid-message';
import { configurationManager } from '../../test/factories/configurations';
import { eventEmitted } from '../../test/emitter-helpers';
const mockMemoryUsage = jest.fn();
const MIN_MB = 1;

process.memoryUsage = mockMemoryUsage;
mockMemoryUsage.mockImplementation(() => ({
  heapUsed: MIN_MB,
  rss: MIN_MB
}));

describe('KafkaConsumer', () => {
  let consumer: EventConsumer;
  beforeEach(() => kafkaNode.reset());
  beforeEach(async () => {
    consumer = new EventConsumer(testRouter(), configurationManager);
    await consumer.start();
  });

  it('process a message', async () => {
    const emitted = jest.fn();
    consumer.on('next', emitted);
    const message = testMessage();
    kafkaNode.spies.trigger('ConsumerGroupStream', 'data', message);
    await eventEmitted(consumer, 'next');
    expect(emitted).toBeCalledWith(message);
  });

  it('lets invalid messages pass through', async () => {
    const emitted = jest.fn();
    consumer.on('next', emitted);
    const message = testInvalidMessage();
    kafkaNode.spies.trigger('ConsumerGroupStream', 'data', message);
    await eventEmitted(consumer, 'next');
    expect(emitted).toHaveBeenCalledWith(message);
  });

  it('emits errors on errors', async () => {
    const error = jest.fn();
    const next = jest.fn();
    consumer.on('next', next);
    consumer.on('error', error);

    kafkaNode.spies.trigger('ConsumerGroupStream', 'data', testMessage('throw'));
    kafkaNode.spies.trigger('ConsumerGroupStream', 'data', testMessage());
    await eventEmitted(consumer, 'error');
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
  });
});
