import typeDefs from "./schema";
import resolvers from "./resolvers";
import { init } from "@bwa/botframe";

const apiConfig = {
  typeDefs,
  introspection: true,
  context: init(),
  resolvers
};

export default apiConfig;
