import { controller, httpPost } from "inversify-express-utils";
import { Link, Tab, Setting, Service } from "../models";
import express from "express";
import { CustomBaseController } from "./CustomBaseController";
import { SettingsHelper } from "../helpers";

@controller("/churches")
export class ChurchController extends CustomBaseController {

    async validateInit(churchId: number) {
        const errors = [];
        const setting = await this.repositories.setting.loadByChurchId(churchId);
        if (setting !== null) errors.push("Church already initialized");
        return errors;
    }

    @httpPost("/init")
    public async init(req: express.Request<{}, {}, {}>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {

            const errors = await this.validateInit(au.churchId);
            if (errors.length > 0) return this.denyAccess(errors);
            else {

                const promises: Promise<any>[] = [];

                const links: Link[] = [];
                links.push({ churchId: au.churchId, url: "about:blank", text: "Resources", sort: 1 });
                links.push({ churchId: au.churchId, url: "about:blank", text: "Give", sort: 2 });
                links.forEach(l => promises.push(this.repositories.link.save(l)));

                const tabs: Tab[] = [];
                tabs.push({ churchId: au.churchId, url: "", text: "Chat", sort: 1, icon: "far fa-comment", tabType: "chat", tabData: "" });
                tabs.push({ churchId: au.churchId, url: "https://www.bible.com/en-GB/bible/111/GEN.1.NIV", text: "Bible", sort: 2, icon: "fas fa-bible", tabType: "url", tabData: "" });
                tabs.push({ churchId: au.churchId, url: "", text: "Prayer", sort: 3, icon: "fas fa-praying-hands", tabType: "prayer", tabData: "" });
                tabs.forEach(t => promises.push(this.repositories.tab.save(t)));

                const setting: Setting = { churchId: au.churchId, homePageUrl: "https://livecs.org", logoUrl: "/images/default-site-logo.png", primaryColor: "#24B9FF", contrastColor: "#FFFFF;", registrationDate: new Date() };
                promises.push(this.repositories.setting.save(setting))

                const service: Service = {
                    churchId: au.churchId, serviceTime: new Date(), earlyStart: 600, duration: 3600, chatBefore: 600, chatAfter: 600,
                    provider: "youtube_watchparty", providerKey: "zFOfmAHFKNw",
                    videoUrl: "https://www.youtube.com/embed/zFOfmAHFKNw?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1",
                    timezoneOffset: 300, recurring: false
                };
                promises.push(this.repositories.service.save(service))

                await Promise.all(promises);

                await SettingsHelper.publish(au.churchId, this.repositories, this.logger);
                return {};
            }

        });
    }


}


