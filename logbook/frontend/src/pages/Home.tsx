import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Container, Row, Col } from 'react-bootstrap';
import { StoreContext } from '../index';
import SitesList from "../components/SitesList";
import SitesMap from "../components/SitesMap";
import { Site } from '../lib/types';

const Home = observer(() => {
    const store = useContext(StoreContext);
    const [selectedSite, setSelectedSite] = useState<Site>();

    return (
        <Container>
            <Row>
                <Col lg className='m-0 p-0'>
                    <SitesMap sites={store.sites} selectedSite={selectedSite} width='100%' height={600} />
                </Col>
                <Col>
                    <SitesList onClick={setSelectedSite} />
                </Col>
            </Row>
        </Container>
    )
})

export default Home;
