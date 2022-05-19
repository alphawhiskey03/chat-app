import "./App.scss";
import { Button, Container, Row, Col } from "react-bootstrap";
import Register from "./pages/register.page";
import Login from "./pages/login,page";
import Home from "./pages/home.page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/auth.util";
import CheckRoute from "./utils/checkRoute.utils";
import { MessageProvider } from "./utils/messages.utils";

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <Container>
          <Row className="justify-content-center">
            <Col sm={8} md={6} lg={8}>
              <Router>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <CheckRoute authenticated>
                        <Home />
                      </CheckRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <CheckRoute guest>
                        <Register />
                      </CheckRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <CheckRoute guest>
                        <Login />
                      </CheckRoute>
                    }
                  />
                </Routes>
              </Router>
            </Col>
          </Row>
        </Container>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
