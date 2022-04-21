# Design a Tiny URL

---

## Functional Requirements

- Make URL short
- Short link should redirect to original link
- Should able be specify the expiration time
- [Optional] Analytivs for how many redirection happened
- [Optional] Expose services using REST API

## Non-Functional Requirements

- Highly available
- URL redirection should happen in minimal latency
- Short URL should not be predicted

## Capacity Estimation

- System will be read heavy
- Read write ratio can be 100:1

### Traffic Estimate

- 500M new URL Shortenings per month
- With read:write ratio of 100:1, the our redirect operation will be total of 100 \* 500M = 50B
- Since we have monthly total 500M requests (500,000000), per second we will have (500M / 1 month) = ~ 200 URL/s. This is the write operation
- With read:write ration of 100:1, total URL redirection or read operation will be (200 URL/s \* 100) = 20K URL/s. This is the read operation

### Storage Estimate

- Store each URL for 5 years along with their short-hand version
- Since each month, we store 500M URL, we will end up storing (500M _ 5 Years) = (500M _ 5 \* 12) = 30B URL object
- If we consider each URL object is 500 bytes, then we will need stores (30B \* 500 Bytes) = 15TB storage

### Bandwidth Estimate

- For write requests, we have already calculated, 200 new URL per seconds. Since we are assuming each URL is 500 bytes, total incoming bandwidth will be (200 \* 500 bytes) = 100kB/second.
- For read requests, we have already calculated, 20k URL per seconds. Since we are assuming each URL is 500 bytes, total outgoing bandwidth will be (20,000 \* 500 bytes) = 10MB/second.

### Memory Estimate (Per Day)

- If we consider, 20% URL's are making 80% traffic, then we have to cache 20% of hot URLs.
- Each day we will usually get traffic of (20k \* 1 day) = 20K \* 24h \* 3600s = 1.7B
- For 20% of these requests, we will need, (0.2 \* 1.7B Request \* 500 bytes) = ~170GB

## System API

- Create URL
- Delete URL

> To prevent the number of request to an endpoint, we will introduce a dev key, should be passed through the api call. These dev key should have a specific limits.


### Create URL

As params,

- api_dev_key
- original_url
- expire_date

As results, return a short URL.

### Delete URL

Should get a db url, and remove it from db

## Database Design

We will need two tables/collections,

**URL**

- hash (unique identifier, the short url)
- original URL
- creation date
- expiry date
- user id

**User**

- user id (unique indetifier)
- email
- creation date

As we are about to store billions of rows and we do not have to maintain the strong relations betwee collections/table, we can simply use NoSQL database for easy scale.

## System Design

### Encoding URL

From the long url, we can compute the unique short URL using the hash function, MD5 or Sha256. Then the hash can be encoded for display. For encoding, we can use base36, base62 or base64.

If we consider 6 character short URL, the possible combination will be 64^6 = ~ 68 billion.

With MD5 hashing function, we will get 128 bit hash value. Since 1 hex digit is 4 bits, we will get total of 32 hex digits as output from MD5 hashing. We are only allowed to take only 6 characters and if we take the first 6 characters, it might give us duplicate short url.

With this mechanism, we have two problem,

1. Multiple users with same url will get same shortend url
2. Encoded URL are identical [TODO]

To resolve this, we can either add a sequence number or counter to the original URL and do the hashing untill we get a unique shortend URL.

> base36 includes a-z and 0-9
> base62 includes a-z, A-Z and 0-9
> base64 includes a-z, A-Z, 0-9, + and /


### Offline Key Generation Service

We will generate random 6 digits url beforehand. When a url needs to be shortend, just take on from the already generated urls.

Any time a key is being used, we have to mark it as used. If multiple server tries to read a key same time, it will make same short url for multiple urls.

We can use two collections in the key service, used and new. Will use a memory, where the key service first load some keys for use. In the same time, we will send them from new collection to used collection.

Servers will get the keys from the memory.

**DB Size**

When we do need a 68B url, with each 6 charactars long, each character with 1 bit, we will need (68B * 6 bit) = ~415 GB storage

**Availability**

Have to make sure there is an standby rserver for the service.

**Performance Improvement**

The application server can cache couple of keys beforehand. In case the app server crash, we might loose couple of unique keys.

## Data partitioning and Replication

We can partition database by,

1. Range Based Partitioning: Can partition the database by the start character. In this case, if a certain characted appears in the most url, the one partition may have more traffic than others.
2. Hash Based Partitoning (Consistant Hashing): We can do the hashing to the shortend url and this hash will determine the range. 

## Cache



### Summary

- What are the size of the shortend url?
- Volume of traffic?
- Is the system single instance or will be scaleable?
-  