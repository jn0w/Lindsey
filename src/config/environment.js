// Configuration for environment variables with defaults
const environment = {
  // MongoDB
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb+srv://jakub:<db_password>@ourmemories.3c7pw1c.mongodb.net/?retryWrites=true&w=majority&appName=OurMemories",
    dbName: "ourmemories",
    collections: {
      memories: "memories",
    },
  },

  // API
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  },
};

export default environment;
