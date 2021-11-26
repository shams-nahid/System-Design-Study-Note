# Distributed Message Queue

A message queue system helps to make an application or multiple services as loosely coupled. For example, if a client make a heavy duty api/service call, the request can be stored in a message queue until the request is being resolved.This results improved reliability, so even if the request can not be resolved immediately, will be proceed later.

### Advantages of Using Distributed Message Queue

---

**Loosely Coupled** Multiple language services communication

**Better Performance/Async Communication**

**Responsive System** For a service call, even the system is under heavy load, the request will not be lost

**Improved Reliability** Since data is persisted, app can run offline

**SAGA Transactions** All or nothing operations can be handled

### Core Components

---

A message queue usually have following components,

- Message Producer
- Message Consumer
- Message Broker

**Message Producer**: Creates a task/message and put it in the pipeline/message-broker.
**Message Consumer**: Take messages/tasks from the pipeline and then resolve/reject it.
**Message Broker**: This is message/task lake, stores all the messages and logically placed between message-producer and message-consumer.

Another very common component is `filter` in a message queue. Usually two types of filters are being used,

1. Topic Based Filtering: Messages with defined topic are stored in a logical channels.
2. Content Based Filtering: Messages with defined property will go to specific consumer.

### Message Delivery

---

When it comes to deliver messages to consumer, there are couple of models we can consider depends on the applications requirements.

**At Least Deliver Once** In this model, a consumer may get a message multiple times (At least once). The system will never loose the message. So it provides high availability, but in the consumer, have to handle the duplication criteria. In most cases, system uses this type of model.

**At Most Once Delivery** When the data is not very important, this model can be used. It does not ensures, the message will be consumed by the consumer. This is the model offers most of the throughput. It only uses when we process less important logs/data sampling.

**Exactly Once Delivery** The most ideal architecture, where the message will be consumed only one time, no lost or duplication. But in a distributed system, this brings tons of complexity and performance overhead. Due to design complexity and performance is not used.

### Types of Message Broker System

---

**P2P Message Queue**: Can have following models,

- Single Producer, Single Consumer
- Single Producer, Multiple Consumer
- Multiple Producer, Single Consumer
- Multiple Producer, Multiple Consumer

> Even if there are multiple consumer, only one consumer will consume the message
> Needs a acknowledgement form consumer to producer, the message is being consumed

Messages in theses broker can have following states,

- Ready State: Ready to be consumed
- Processing State: Message is being processing by a consumer
- Proceed State: Message is already consumed by a consumer
- Delay State: Message is waiting for a certain time before it appears in the message queue
- Expired State: Message being in the queue in too many times/failed to be proceed for certain times
- Visibility Timeout State: Message is taken by a consumer and will be invisible for a certain times

**Pub-Sub Message Queue**

Multiple consumers can consumed messages independently. Also no need of acknowledgement to the publisher. In this pub-sub model, the publishers publish message as topic and the subscriber related to these topic will consumed these messages.

It can have models like,

- Single Publisher, Single Subscriber
- Single Publisher, Multiple Subscriber
- Multiple Publisher, Single Subscriber
- Multiple Publisher, Multiple Subscriber

**Message Ordering**

- FIFO Queue: Message are consumed as they produced. Have limited throughput.
- Standard Queue: Messages have almost unlimited throughput. Here the sequence is not always preserved.

**Message Durability**

- Non Durable Queue / In Memory Queue: Data is persisted in the memory.
- Durable Queue: Data us persisted in disks

Other queues can be, `mirrored queue`, `quorum queue`.
