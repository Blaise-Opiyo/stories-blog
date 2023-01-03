import Container from 'react-bootstrap/Container';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Blog_home from './Components/Blog_home';
import Edit_article from './Components/Edit_article';
import Article from './Components/Article';
import Update_article from './Components/Update_article';
import andrey_zvyagintsev_unsplash from './Assets/andrey-zvyagintsev-x0c6vTO5ibA-unsplash.jpg';
import './App.css';

const App = () => {
  return (
    <Router>
    <div className="App">
      <div className="Mask-container">
        {/* Start of Navigation */}
          <Navbar expand="sm">
            <Navbar.Brand href="#home"><div className="logo-thumb"><img src={andrey_zvyagintsev_unsplash} alt="logo img thumb"/></div>Navbar with text</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <LinkContainer exact to='/'>
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer exact to='/edit-article'>
                  <Nav.Link>New article</Nav.Link>
                </LinkContainer>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
        {/* End of Navigation */}
        {/* <Blog_home /> */}

        {/* Components Routing Start */}
        <Routes>
          {/* <Route exact path="/">
            <Blog_home />
          </Route> */}
          <Route exact path="/" element={<Blog_home/>} />
          <Route exact path="/edit-article" element={<Edit_article/>} />
          <Route path="/Article/:slug" element={<Article/>} />
          <Route path="/Edit/:slug" element={<Update_article/>} />
        </Routes>
        {/* Components Routing End */}
      </div>
    </div>
    </Router>
  );
}

export default App;
