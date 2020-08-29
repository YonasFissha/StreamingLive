import React from 'react';
import { DisplayBox, TabEdit, ServiceInterface, ApiHelper, FormatHelper } from './';
import { ServiceEdit } from './ServiceEdit';

interface Props { updatedFunction?: () => void }

export const Services: React.FC<Props> = (props) => {
    const [services, setServices] = React.useState<ServiceInterface[]>([]);
    const [currentService, setCurrentService] = React.useState<ServiceInterface>(null);

    const handleUpdated = () => { setCurrentService(null); loadData(); props.updatedFunction(); }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/services').then(data => setServices(data)); }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();

        var tz = new Date().getTimezoneOffset();
        console.log(tz);
        var defaultDate = getNextSunday();
        defaultDate.setTime(defaultDate.getTime() + (9 * 60 * 60 * 1000) - (tz * 60 * 1000));

        var link: ServiceInterface = { churchId: 1, serviceTime: defaultDate, chatBefore: 600, chatAfter: 600, duration: 3600, earlyStart: 600, provider: "youtube_live", providerKey: "", recurring: false, timezoneOffset: tz, videoUrl: "" }
        setCurrentService(link);
        loadData();
    }

    const getNextSunday = () => {
        var result = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        while (result.getDay() !== 0) result.setDate(result.getDate() + 1);
        return result;
    }

    const getRows = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        services.forEach(service => {
            var localServiceTime = new Date(service.serviceTime);
            //localServiceTime.setMinutes(localServiceTime.getMinutes() - service.timezoneOffset);



            rows.push(
                <tr>
                    <td>{FormatHelper.prettyDateTime(localServiceTime)}</td>
                    <td className="text-right">
                        <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentService(service); }}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                </tr>
            );
            idx++;
        })
        return rows;
    }

    React.useEffect(() => { loadData(); }, []);


    if (currentService !== null) return <ServiceEdit currentService={currentService} updatedFunction={handleUpdated} />;
    else return (
        <DisplayBox headerIcon="far fa-calendar-alt" headerText="Services" editContent={getEditContent()} id="servicesBox" >
            <table className="table table-sm">
                {getRows()}
            </table>
        </DisplayBox>

    );

}