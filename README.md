# winston3-kafka

A [Winston 3](https://github.com/winstonjs/winston) transport for logging to [Apache Kafka](http://kafka.apache.org/).

Developed at AID:Tech.

## Installation 

## Installation
```npm install git+https://github.com/aidtechnology/winston3-kafka.git```

## Usage

```js
var winston = require('winston');
winston.transports.Kafka = require('winston3-kafka');

var options = {
  topic: 'logs',
  clientOptions: {
      kafkaHost: {'localhost:9092'}  // We connect directly to Kafka, rather than Zookeeper
  }
};

winston.add(new winston.transports.Kafka(options));
```

### Options
- `topic` - (required) Kafka topic
- `clientOptions` - node-kafka KafkaClient options
- `producerOptions` - node-kafka HighLevelProducer options
- `compression` - Compression to use on messages sent to Kafka (0: none [default], 1: Gzip, 2: Snappy)
