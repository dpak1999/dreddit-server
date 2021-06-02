/** @format */
import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import mikroOrmConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  // server setup
  const app = express();

  // redis setup
  const RedisStore = connectRedis(session);
  const redisCient = redis.createClient();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisCient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "ajksdbsdnczkjdshdkjas",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Server started at port 4000");
  });
};

main();
