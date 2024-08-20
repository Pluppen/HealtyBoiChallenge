import { createContext, useState, useContext } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";

import Shader from "./Shader";
import Game from "./Game";
import NavigationBar from "./components/NavigationBar";
import Login from "./Login";
import Logout from "./Logout";

interface IAuthContext {
  user: any;
  signin: any;
  signout: any;
  token: any;
  updateUserData: any;
}

const authContext = createContext<IAuthContext>({
  user: null,
  signin: null,
  signout: null,
  token: null,
  updateUserData: null,
});

export const useAuth = () => {
  return useContext(authContext);
};

const ProvideAuth = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<any>(null);

  const signin = (data: any, cb: any) => {
    setUser(data.user);
    setToken(data.token);
    cb();
  };

  const signout = () => {
    setUser("");
  };

  const updateUserData = (user: any) => {
    setUser(user);
  };

  const contextValue = {
    user,
    signin,
    signout,
    updateUserData,
    token,
  };

  return (
    <authContext.Provider value={contextValue}>{children}</authContext.Provider>
  );
};


const PrivateRoute = ({ children }: any) => {
  let { user } = useAuth();
  let location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Press+Start+2P"
            rel="stylesheet"
          />
          <link href="https://unpkg.com/nes.css/css/nes.css" rel="stylesheet" />
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"
          />
        </Helmet>
        <NavigationBar />
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/logout" Component={Logout} />
          <Route
            path="/shader"
            element={
              <PrivateRoute>
                <Shader />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
