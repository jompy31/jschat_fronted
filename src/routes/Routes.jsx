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

// Public Pages
const Error404 = lazy(() => import("../containers/errors/Error404"));
const Directorio = lazy(() => import("../containers/pages/home"));
const Promociones = lazy(() => import("../containers/pages/Promociones"));
const Sobre_nosotros = lazy(() => import("../containers/pages/sobre_nosotros"));
const Catalogo = lazy(() => import("../containers/pages/Catalogo"));
const Cotizador = lazy(() => import("../containers/pages/cotizador/Cotizador.jsx"));
const Blog = lazy(() => import("../containers/pages/blog/manage_blog.js"));
const Contactenos = lazy(() => import("../containers/pages/Contactenos"));
const Login = lazy(() => import("../components/login/login"));
const Signup = lazy(() => import("../components/login/signup"));
const CurrentUser = lazy(() => import("../components/login/CurrentUser"));

// Authenticated Pages
const Profile = lazy(() => import("../components/backend/profile"));
const Files = lazy(() => import("../components/backend/files"));
const Calendar = lazy(() => import("../components/backend/calendar"));

// Admin/Sales/Design Pages
const UserList = lazy(() => import("../components/backend/users"));
const Register = lazy(() => import("../components/backend/users/register.js"));
const Customers = lazy(() => import("../components/backend/customers"));
const CustomerDetail = lazy(() => import("../components/backend/customers/detail"));
const Orders = lazy(() => import("../components/backend/orders"));
const OrderDetail = lazy(() => import("../components/backend/orders/detail"));
const OrderCreate = lazy(() => import("../components/backend/orders/create"));
const OrderAddEvent = lazy(() => import("../components/backend/orders/add_event"));
const Products = lazy(() => import("../components/backend/products"));
const ProductDetail = lazy(() => import("../components/backend/products/detail"));
const Promotions = lazy(() => import("../components/backend/promotions"));
const PromotionDetail = lazy(() => import("../components/backend/promotions/detail"));
const CustomerPoints = lazy(() => import("../components/backend/customer_points"));
const ProductionQueues = lazy(() => import("../components/backend/production_queues"));
const Settings = lazy(() => import("../components/backend/settings"));

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

        const [productsRes, clasificadosRes, servicesRes] = await Promise.all([
          ProductDataService.getAll(token),
          FileDataService.getAllPost(token),
          ProductDataService.getAllServices(token),
        ]);

        while (hasNextPage) {
          const subproductsRes = await ProductDataService.getAllSubProduct(token, page, 100);
          const subproductsData = subproductsRes.data.results || [];
          allSubproducts = [...allSubproducts, ...subproductsData];
          hasNextPage = subproductsRes.data.next !== null;
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
        localStorage.setItem("currentUser", JSON.stringify({ 
          email: user.username, 
          userprofile: { staff_status: response.data.staff_status } 
        }));
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
        localStorage.setItem("currentUser", JSON.stringify({ 
          email: user.username, 
          userprofile: { staff_status: response.data.staff_status } 
        }));
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
              {/* Public Routes */}
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
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/promociones" element={<Promociones />} />
              <Route path="/sobre_nosotros" element={<Sobre_nosotros />} />
              <Route path="/cotizador" element={<Cotizador />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contactenos />} />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/signup" element={<Signup signup={signup} />} />
              <Route path="/current_user" element={<CurrentUser token={token} user={user} />} />

              {/* Private Routes (Authenticated Users) */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/files" element={<Files />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/customers" element={<Customers token={token} user={user}/>}>
                  <Route path=":id" element={<CustomerDetail />} />
                </Route>
                <Route path="/orders" element={<Orders />}>
                  <Route path="new" element={<OrderCreate />} />
                  <Route path=":id" element={<OrderDetail />} />
                  <Route path=":id/add_event" element={<OrderAddEvent />} />
                </Route>
                <Route path="/customer-points" element={<CustomerPoints />} />
              </Route>

              {/* Admin/Sales/Design Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/register" element={<Register signup={signup} />} />
                <Route path="/products" element={<Products />}>
                  <Route path=":id" element={<ProductDetail />} />
                </Route>
                <Route path="/promotions" element={<Promotions />}>
                  <Route path=":id" element={<PromotionDetail />} />
                </Route>
                <Route path="/production-queues" element={<ProductionQueues />} />
                <Route path="/settings" element={<Settings />} />
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