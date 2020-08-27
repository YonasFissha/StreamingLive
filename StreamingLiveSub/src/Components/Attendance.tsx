import React from 'react';
import { ChatViewerInterface } from '../helpers';

interface Props {
    viewers: ChatViewerInterface[] | undefined
}

export const Attendance: React.FC<Props> = (props) => {
    const [showList, setShowList] = React.useState(false);

    const toggleAttendance = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowList(!showList);
    }

    const getViewerCount = () => {
        var totalViewers = 0;
        if (props.viewers !== undefined) props.viewers.forEach((v) => { totalViewers += v.count });
        if (totalViewers === 1) return '1 viewer online';
        else return totalViewers.toString() + ' viewers online';
    }

    const getChevron = () => {
        if (showList) return <i className="fas fa-chevron-up"></i>
        else return <i className="fas fa-chevron-down"></i>
    }

    const getPeople = () => {
        var result = null;
        if (showList && props.viewers !== undefined) {
            var people = [];
            for (let i = 0; i < props.viewers.length; i++) {
                var v = props.viewers[i];
                var countSpan = (v.count > 1) ? <span>({v.count})</span> : null;
                people.push(<div key={i}><i className="fas fa-user-alt"></i>{v.displayName} {countSpan}</div>);
            }
            result = <div id="attendance">{people}</div>
        }
        return result;
    }

    return (
        <>
            {getPeople()}
            <a id="attendanceCount" href="about:blank" onClick={toggleAttendance}>{getViewerCount()} {getChevron()}</a>
        </>
    );
}




