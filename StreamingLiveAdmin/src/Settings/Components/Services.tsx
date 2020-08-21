import React from 'react';
import { DisplayBox, TabEdit, ServiceInterface, ApiHelper } from './';
import { ServiceEdit } from './ServiceEdit';

export const Services = () => {
    const [services, setServices] = React.useState<ServiceInterface[]>([]);
    const [currentService, setCurrentService] = React.useState<ServiceInterface>(null);

    const handleUpdated = () => { setCurrentService(null); loadData(); }
    const getEditContent = () => { return <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a> }
    const loadData = () => { ApiHelper.apiGet('/services').then(data => setServices(data)); }
    const saveChanges = () => { ApiHelper.apiPost('/services', services).then(loadData); }

    const handleAdd = () => {
        var link: ServiceInterface = { churchId: 1, serviceTime: new Date(), chatBefore: 15, chatAfter: 15, duration: 3600, earlyStart: 600, provider: "youtube_live", providerKey: "", recurring: false, timezoneOffset: 0, videoUrl: "" }
        setCurrentService(link);
        loadData();
    }


    const getRows = () => {
        var idx = 0;
        var rows: JSX.Element[] = [];
        services.forEach(service => {
            rows.push(
                <tr>
                    <td>{service.serviceTime.toLocaleString()}</td>
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