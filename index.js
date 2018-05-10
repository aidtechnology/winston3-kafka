/*jshint esversion: 6 */

const Transport = require('winston-transport');
const { MESSAGE } = require('triple-beam');
const kafka = require('kafka-node');
const _ = require('lodash');

let _isConnected = false;

/**
 * Transport for outputting to Kafka.
 * Inherits from WinstonTransport to take advantage of `.exceptions.handle()`.
 * 
 * @type {Kafka}
 * @extends {TransportStream}
 */
module.exports = class Kafka extends Transport {
    constructor(options) {
        super(options);

        this.topic = options.topic;
        this.level = options.level || 'info';
        this.meta = options.meta || {};
        this.compression = options.compression || 0;  // Either 0, 1 (Gzip) or 2 (Snappy) 
        this.clientOptions = options.clientOptions || {};
        this.producerOptions = options.producerOptions || {};
        
        // Connect
        this.client = new kafka.KafkaClient(this.clientOptions);
        this.producer = new kafka.HighLevelProducer(this.client, this.producerOptions);

        this.producer.on('ready', function () {
            _isConnected = true;
        });
    
        this.producer.on('error', function (err) {
            _isConnected = false;
            console.error('winston3-kafka: Cannot connect to Kafka', err);
        });
    }

    log(info, callback) {
        let self = this;
        if (_isConnected) {
            // Send the message from the info object
            var payloads = [
                {
                    topic: self.topic,
                    messages: [info[MESSAGE]],
                    attributes: self.compression
                }
            ];
    
            self.producer.send(payloads, function(err, data) {
                if (err) {
                    console.error('Failed to log to Kafka', err);
                } else {
                    // If we succeed, let us emit a logged event
                    setImmediate( () => {
                        self.emit('logged', info);
                    });
                }
            });
        }
        if (callback) {
            callback(); // eslint-disable-line callback-return
        }
    }
};
