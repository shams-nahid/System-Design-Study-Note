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



### Summary

- What are the size of the shortend url?
- Volume of traffic?
- Is the system single instance or will be scaleable?
-  