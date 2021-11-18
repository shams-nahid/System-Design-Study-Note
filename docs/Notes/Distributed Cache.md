# Distributed Caching

Caching data helps to improve application performance. Failing the caching service will put extreme load to the database and results poor performance, in worst case, can crash the service. While we design a caching service, we should consider low latency in minimum cost possible. Depending on the scenario and application requirements, we should choose the appropriate and affordable caching mechanism. A caching mechanism should offer,

- Store data
- Define how data will be stored
- Remove/invalid data
- Define how data will be replaced
- Get data

### Caching Advantages

---

- Minimize the computations for complex query in the database layer
- Minimize network call
  - API caching reduce `API Gateway -> Application Service` calls
  - Database caching can reduce `Application Service -> Database` queries
- Storing the users sessions data. Example can be
  - Store users cart in e-commerce application
  - Sore info of rides or drivers in a ride sharing app of their position

### Types of Caching

---

- Read Through
  - Storing data to database is handled by the `Cache` itself.
  - Application first go to the cache store to fetch the data
  - If data exist in the cache store it return the data to application
  - If data does not exist in the cache store, cache itself fetch the data from database
    - It can save the data in the cache and return to the application
    - It can first return the data to application and them save the data in the cache store (Better)
- Write Through
  - Caching is handled by the `Application`
  - Storing data to `Database` can be handled either the `Cache` or `Application`
  - When the `database persist` is handled by `Cache`
    - Application write data to `Cache` store
    - `Cache` store write data to `Database`
    - Require more time to store synchronously in both `Cache` and `Database`
    - Only failure to write data in the `Cache` will send fail status to the client
  - When the `caching` and `database persisting` is handled by the `Application`
    - Both wite operation (Cache and Database) is handled by the application synchronously
    - Faster, because do not have cache write latency
    - On failure to write in cache does not require to send fail status to client
- Cache Aside
  - `Caching` is handle by the application
  - Database is also handle by the application as always
  - Application write data to db, not application nor db write data to cache,
  - Data is stored in the cache, only when it is accessed frequently
  - For each data, first fetch will miss the cache
- Write Back / Behind Cache
  - Any data write operation happen in the `Cache` itself, not in database immediately
  - After certain period or certain condition, the `Cache` data persist in database as batch process
  - If `Cache` crash, data will be lost
  - Any direct operation to the database, that is not persisted yet from cache will be failed
  - Very first write operation for client
- Read / Refresh Cache
  - Data is cached before user looked for
  - Use some prediction engine or machine learning model to decide which data should be loaded
  - In general, periodically some updated data can be loaded to the cache
  - Comparatively complex implementation

### Cache Replacing

---

- **Least Recently Used** Replace the data, that being used the longest time ago
- **Least Frequently Used** Replace the data, that has very low fetch rate
- **Most Recently Used** Replace the most recent data that is used. In this case, the data was cached on prediction that, it might be accessed. Only when it go to the clients, the data is no longer required in the cache
- **FIFO** Replace the oldest data from the cache by caching the latest data

### Placing Cache

According to the requirements, we have to decide how close the cache and application server will be.

It could be,

- Cache will be attached with each application server
- Cache will be in a global place in front of database

If we put the cache along with each application server, it will be faster response. But considering if server fails, the cache will also fail. Also, there will be no sync of cache data between servers.

On the other hand if we use a global database, even though an application fails, the cache data will still available. In this case although it is comparatively slow response, still more accurate and we can scale the caching mechanism independently.

## Design a Distributed Cache

---

### Single Server Caching

Consider

- Read through caching mechanism
- Replace the oldest cache data when store is full
- Has single point of failure and is not fault tolerant
- Not highly available

To store data in cache, we can make use of a hash-map. To replace oldest data, We need to keep track of it. As value of a hash-map, we will use a doubly link list. Any time we need a data, we check in the hash map. If already exists, we will put the position of it to the head and return the data. Otherwise, if the data does not exist in the hash-map, put it in the head and return the data.

When it comes to remove the data, remove the tail data and put the latest data in the head.

For insertion is O(1), since we will always insert at the head. We can check if the data exist in the hashmap by O(1).

### Scalability

We can use multiple servers and put the keys of the hash-map in different server using partition or shards. To keep the server fault tolerant, we have to replicate each of the partitions.

We can partition/shard the servers using,

**Partition By Key Range** Here we partition the key with range. For example, If key is user name, we can create 26 partition and each partition will go to each of the corresponding partition. If we use id as integer, we can put 1000 user each of the partition.

**Partition By Hash of the Key** A good hash function can make sure the key is uniformly distributed. We can use the hash function to uniformly distribute the keys among all the partitions.

### Fault-tolerant

Some old school way can be,

- Regular interval snapshot: After certain intervals, we can take the frozen copy of the cache and put it inside the regular storage system.
- Log reconstruction: For each operation, we can put the logs inside a storage. In future, we can get the data from the logs. We can use async operation or a queue for this logging mechanism to not block the cache operations.

**Using Multiple Servers**

If we just replicate the single server and it will make the design fault tolerant. This will also improve the read operation. It does not improve the scalability issue, it still has the same memory service as previous.

For multiple server, we can have following approaches,

- **Single Master** It is the master server responsibility to replicate/write data to the slaves and also determine to get data from. In case of master server goes down, one of the slave will become the master.
- **Multiple Master** Multiple master responsible to replicate/write data to their slaves.
- **No Master** Application layer handle the replication to different replicas.

### Data Replication Between Servers

- **Asynchronous Data Replication**
  - Data replicated from master to slave asynchronously
  - If master crashed before the child replication and slave become master, the missed replicated data will not be found in the cache
  - Read operation should be go through the master server only, since the slave is replicated asynchronously
- **Synchronous Data Replication**
  - Data is replicated synchronously
  - Both master and slave can performed operation
  - Slave is in a standby position of becoming master
  - Successful write operation require write in master and replicate in slaves

### Data Replacing & Expiration

For two or more replicas, we have to change the pointer in linked list for keep the most recent data at the head. If we do this to all the read replicas, we need to use a networking to notify all to update the sequence of the linked list. This is a costly operation and usually only the master does the ordering. When it comes to expire the data, replicas watch the event of delete of the master and delete the key. We can also put a TTL to expire the data.

## Topology

If we start with a bigger partition initially, in future, when we will add partition, we have to move less amount of data. It is important to consider, these are **logical partition**, not physical.

Let's we started with 1000 partition, not physical. With 3 replicas for each partition, we will have 3000 partition. In this case, we can put all these 3000 replicas in 3 different servers.

With increasing number of key-values (data), we can introduce more partition as well as more servers.

Here **Topology Managers** consists of following information,

- Number of partition
- Range of keys stored in these partitions
- Number of replicas for each partition
- List of primary and secondary replicas
- Mapping of replicas to physical servers
- Number of successful reads
- Number of successful writes

This topology manager can use a event loop that runs continuously. All the read/write request will be stored in the queue. The even loop is a single threaded operation. It looks at the thread pool. Any time the thread pool has empty thread, it took request from queue and put it inside the thread for operation. After the operation is completed, it can either invoke the callback or send response with totally different mechanism.

### SDK for Topology Manager

An application server usually does the following operation to a cache,

- Read data
- Invalid/Delete data
- Update data

This can be done by two ways,

- Client side SDK
- Proxy server

With client side sdk,

- Developer can directly talk to application server
- But in any changes to the caching mechanism all these application have to update their sdk code or maintain the backward compatibility with sdks

With a thin layer of proxy server with a load balancer,

- For any operation, client will hit the proxy server
- Operation like add(), invalid(), delete() will be implemented in proxy server
- For any update to the caching mechanism, no need to worry for the client
