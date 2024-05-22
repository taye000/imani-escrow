import "dotenv/config";

export const config = {
  APP: {
    MONGO_URI: process.env.MONGODB_URI,
    BASE_URL: process.env.BASEURL,
  },
};
