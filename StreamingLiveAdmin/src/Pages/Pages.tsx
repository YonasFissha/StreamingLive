import React from 'react';
import { Row, Col } from 'react-bootstrap'
import { PageList, PageEdit, ApiHelper, PageInterface } from './Components'

export const Pages = () => {
    const [pages, setPages] = React.useState<PageInterface[]>([]);
    const [currentPage, setCurrentPage] = React.useState<PageInterface>(null);

    const loadData = () => { ApiHelper.apiGet('/pages').then(data => setPages(data)); }
    const handleUpdate = () => { setCurrentPage(null); }
    const handleAdd = () => { setCurrentPage({ churchId: 1, lastModified: new Date(), name: "" }) }
    const handleEdit = (page: PageInterface) => { setCurrentPage(page); }

    React.useEffect(() => { loadData(); }, []);

    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-code"></i> Pages</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <PageList pages={pages} addFunction={handleAdd} editFunction={handleEdit} />
                </Col>
                <Col md={4}>
                    <PageEdit page={currentPage} updatedFunction={handleUpdate} />
                </Col>
            </Row>
        </>
    );
}
