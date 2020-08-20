import { AsyncContainerModule } from "inversify";
import { LinkRepository, PageRepository, Repositories, ServiceRepository, TabRepository, SettingRepository } from "./repositories";
import { TYPES } from "./constants";
import { WinstonLogger } from "./logger";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  await require("./controllers");

  bind<LinkRepository>(TYPES.LinkRepository).to(LinkRepository).inSingletonScope();
  bind<PageRepository>(TYPES.PageRepository).to(PageRepository).inSingletonScope();
  bind<Repositories>(TYPES.Repositories).to(Repositories).inSingletonScope();
  bind<ServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository).inSingletonScope();
  bind<SettingRepository>(TYPES.SettingRepository).to(SettingRepository).inSingletonScope();
  bind<TabRepository>(TYPES.TabRepository).to(TabRepository).inSingletonScope();
  bind<WinstonLogger>(TYPES.LoggerService).to(WinstonLogger);
});
