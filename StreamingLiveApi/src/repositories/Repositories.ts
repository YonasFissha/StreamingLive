import { inject, injectable } from "inversify";
import { TYPES } from "../constants";
import { LinkRepository, PageRepository, ServiceRepository, TabRepository } from ".";

@injectable()
export class Repositories {
    private _link: LinkRepository;
    private _page: PageRepository;
    private _service: ServiceRepository;
    private _tab: TabRepository;



    public get link(): LinkRepository {
        return this._link;
    }

    public get page(): PageRepository {
        return this._page;
    }

    public get service(): ServiceRepository {
        return this._service;
    }

    public get tab(): TabRepository {
        return this._tab;
    }

    constructor(
        @inject(TYPES.LinkRepository) link: LinkRepository,
        @inject(TYPES.PageRepository) page: PageRepository,
        @inject(TYPES.ServiceRepository) service: ServiceRepository,
        @inject(TYPES.TabRepository) tab: TabRepository
    ) {
        this._link = link;
        this._page = page;
        this._service = service;
        this._tab = tab;
    }
}
