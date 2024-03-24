import { createBrowserRouter } from "react-router-dom";
import ListMovie from "./components/blog/ListMovie";
import AddMovie from "./components/blog/AddMovie";
import EditMovie from "./components/blog/EditMovie";
import ViewMovie from "./components/blog/ViewMovie";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Contactus from "./components/Contactus";
import Home from "./components/blog/Home";
import AddShow from "./components/blog/AddShow";
import BookTicket from "./components/blog/BookTicket";
import PickDate from "./components/blog/PickDate";
import MyBookings from "./components/blog/MyBookings";
import MyBookingsList from "./components/blog/MyBookingsList";
import BookingDetails from "./components/blog/BookingDetails";
import ShowList from "./components/blog/ShowList";
const router = createBrowserRouter([
    { path: '', element: <Home /> },
    { path: 'add', element: <AddMovie /> },
    { path: 'list/:postId/edit', element: <EditMovie /> },
    { path: 'view/:postId', element: <ViewMovie /> },
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <Signup /> },
    { path: 'contactus', element: <Contactus /> },
    { path: 'list', element: <ListMovie /> },
    { path: 'addshow', element: <AddShow /> },
    { path: 'book/:postId', element: <BookTicket /> },
    { path: 'addbookings/:postId', element: <PickDate/> },
    { path: 'mybookings', element: <MyBookingsList/> },
    { path: 'mybookings/:postId', element: <MyBookings/> },
    { path: 'bookingdetails', element: <BookingDetails/> },
    { path: 'listshow', element: <ShowList/>}
]);

export default router;