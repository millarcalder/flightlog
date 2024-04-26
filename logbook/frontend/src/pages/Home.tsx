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
                <Col>
                    <h1>Home</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <SitesMap sites={store.sites} selectedSite={selectedSite} />
                </Col>
                <Col>
                    <SitesList setSelectedSite={setSelectedSite} />
                </Col>
            </Row>
        </Container>
    )
})

export default Home;
