import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "../hooks/AuthContext";
import TodoDataService from "../services/todos";
import ProductDataService from "../services/products";
import FileDataService from "../services/files";
import store from "../redux/store";
import Sidebar from "../components/navigation/sidebar";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer.js";
import PrivateRoute from "./Rutas_privadas.jsx";
import AdminRoute from "./Rutas_privadas_admin.jsx";
import "../App.css";

const Error404 = lazy(() => import("../containers/errors/Error404"));
const Directorio = lazy(() => import("../containers/pages/home"));
const Faq = lazy(() => import("../containers/pages/home/abcupon/Faq.jsx"));
const Catalogo = lazy(() => import("../containers/pages/Catalogo"));
const ComerciosAfiliados = lazy(() => import("../containers/pages/ComerciosAfiliados"));
const Publiembudo = lazy(() => import("../containers/pages/Publiembudo"));
const SubproductDetails = lazy(() => import("../containers/pages/home/details/subproductdetails"));
const AvisosClasificados = lazy(() => import("../containers/pages/avisos_economicos/Avisos_clasificados.jsx"));
const Bolsaempleo = lazy(() => import("../containers/pages/bolsa_empleo/bolsaempleo.jsx"));
const Cotizador = lazy(() => import("../containers/pages/cotizador/Cotizador.jsx"));
const Blog = lazy(() => import("../containers/pages/blog/manage_blog.js"));
const Login = lazy(() => import("../components/login/login"));
const Signup = lazy(() => import("../components/login/signup"));
const UserList1 = lazy(() => import("../components/login/CurrentUser"));
const Profile = lazy(() => import("../components/backend/profile"));
const Files = lazy(() => import("../components/backend/files"));
const UserList = lazy(() => import("../components/backend/users"));
const Register = lazy(() => import("../components/backend/users/register.js"));
const Calendar = lazy(() => import("../components/backend/calendar"));
const Contacts = lazy(() => import("../components/backend/contacts_info"));
const Managejob = lazy(() => import("../components/backend/manage_job"));
const Files_frontend = lazy(() => import("../components/backend/files_frontend"));
const Files_products = lazy(() => import("../components/backend/files_products"));
const Directory = lazy(() => import("../components/backend/directory"));
const Files_news = lazy(() => import("../components/backend/clasificados"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [isSidebar, setIsSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [clasificados, setClasificados] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allSubproducts = [];
        let page = 1;
        let hasNextPage = true;
  
        // Obtener productos, clasificados y servicios
        const [productsRes, clasificadosRes, servicesRes] = await Promise.all([
          ProductDataService.getAll(token),
          FileDataService.getAllPost(token),
          ProductDataService.getAllServices(token),
        ]);
  
        // Obtener todas las páginas de subproductos
        while (hasNextPage) {
          const subproductsRes = await ProductDataService.getAllSubProduct(token, page, 100);
          const subproductsData = subproductsRes.data.results || [];
          allSubproducts = [...allSubproducts, ...subproductsData];
          
          // Verificar si hay más páginas (basado en la respuesta de la API)
          hasNextPage = subproductsRes.data.next !== null; // Asume que la API devuelve un campo 'next'
          page += 1;
        }
  
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setClasificados(Array.isArray(clasificadosRes.data) ? clasificadosRes.data : []);
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
        setSubproducts(allSubproducts);
      } catch (error) {
        console.error("Error al obtener datos:", {
          message: error.message,
          stack: error.stack,
        });
        setProducts([]);
        setClasificados([]);
        setServices([]);
        setSubproducts([]);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);

  const login = (user = null) => {
    TodoDataService.login(user)
      .then((response) => {
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", user.username);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((e) => {
        console.log("login", e);
      });
  };

  const logout = () => {
    setToken("");
    setUser("");
    localStorage.clear();
    window.location.reload();
  };

  const signup = (user = null) => {
    TodoDataService.signup(user)
      .then((response) => {
        login(user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", user.username);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Provider store={store}>
      <AuthProvider value={{ token, login, logout }}>
        <Router>
          <ScrollToTop />
          <Sidebar isSidebar={isSidebar} />
          <Navbar user={user} token={token} logout={logout} setIsSidebar={setIsSidebar} />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="*" element={<Error404 />} />
              <Route
                path="/"
                element={
                  <Directorio
                    products={products}
                    clasificados={clasificados}
                    subproducts={subproducts}
                    services={services}
                  />
                }
              />
              <Route path="/faq" element={<Faq />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/comercios_afiliados" element={<ComerciosAfiliados subproducts={subproducts} />} />
              <Route path="/publiembudo" element={<Publiembudo />} />
              <Route path="/servicios/:subproductId" element={<SubproductDetails />} />
              <Route path="/avisos_economicos" element={<AvisosClasificados />} />
              <Route path="/avisos_economicos/:id" element={<AvisosClasificados />} />
              <Route path="/bolsadeempleo" element={<Bolsaempleo />} />
              <Route path="/bolsadeempleo/:id" element={<Bolsaempleo />} />
              <Route path="/cotizador" element={<Cotizador />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/signup" element={<Signup signup={signup} />} />
              <Route path="/register" element={<Register signup={signup} />} />
              <Route path="/current_user" element={<UserList1 token={token} user={user} />} />
              <Route path="/profile" element={<Profile />} />
              <Route element={<PrivateRoute />}>
                <Route path="/customer" element={<Contacts token={token} user={user} />} />
                <Route path="/files" element={<Files />} />
                <Route path="/calendario" element={<Calendar />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/user" element={<UserList />} />
                <Route path="/empleos" element={<Managejob />} />
                <Route path="/files_frontend" element={<Files_frontend />} />
                <Route path="/files_products" element={<Files_products />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/files_news" element={<Files_news />} />
              </Route>
            </Routes>
          </Suspense>
          <Footer />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;