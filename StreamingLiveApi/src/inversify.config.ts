import { AsyncContainerModule } from "inversify";
import { UserRepository } from "./repositories";
import { TYPES } from "./constants";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  console.log(" I AM MAKING BINDINGS");
  await require("./controllers");

  bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
});
