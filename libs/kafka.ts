import { Kafka } from "@upstash/kafka";

const kafka = () => new Kafka({
  url: "https://amazed-horse-14628-us1-rest-kafka.upstash.io",
  username: "YW1hemVkLWhvcnNlLTE0NjI4JA2OG-ORBH-8FyvzgGyjXdULhKSWgCqLiAmArxk",
  password: "OWI0MTIyMzAtYzQ5Yi00NTVmLWJkMmMtMDI1NGI3ODFiNTgy",
});

export const produce = async (topic: string, msg: object) => await kafka().producer().produce(topic, msg);

export const consume = async (groupId: string, topics: string[]) => await kafka().consumer().consume({
  consumerGroupId: groupId ?? "default",
  instanceId: "instance_1",
  topics: ["system", "test.topic", ...topics],
  autoOffsetReset: "earliest",
});
