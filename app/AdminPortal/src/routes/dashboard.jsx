// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Restaurant from "@material-ui/icons/Restaurant";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import TableList from "views/TableList/TableList.jsx";
import Login from "views/Login/Login.jsx";

const dashboardRoutes = [
  {
    path: "/admin/home",
    sidebarName: "Home",
    navbarName: "Home",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/admin/editmenu",
    sidebarName: "Edit Menu",
    navbarName: "Edit Menu",
    icon: Restaurant,
    component: TableList
  },
  {
    path: "/admin/login",
    sidebarName: "Login",
    navbarName: "Login",
    icon: Restaurant,
    component: Login
  },
  {
    redirect: true,
    path: "/admin/",
    to: "/admin/login",
    navbarName: "Redirect"
  }
  // {
  //   path: "/admin/editfooditem",
  //   sidebarName: "Edit Food Item",
  //   navbarName: "Edit Food Item",
  //   icon: Restaurant,
  //   component: FormPage
  // },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
  // },
  // {
  //   path: "/typography",
  //   sidebarName: "Typography",
  //   navbarName: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography
  // },
  // {
  //   path: "/icons",
  //   sidebarName: "Icons",
  //   navbarName: "Icons",
  //   icon: BubbleChart,
  //   component: Icons
  // },
  // {
  //   path: "/maps",
  //   sidebarName: "Maps",
  //   navbarName: "Map",
  //   icon: LocationOn,
  //   component: Maps
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
];

export const sidebarRoutes = [dashboardRoutes[0], dashboardRoutes[1]];

export default dashboardRoutes;
