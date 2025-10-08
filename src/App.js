//import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import  Header from "./component/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserRegisterForm } from "./component/UserRegisterForm";
import { UserLogin } from "./component/UserLogin";
import { AdminDashboard } from "./Admin/admindashboard";
import AddMovieForm from "./Movie/MovieForm";
import Movies from "./Admin/Movies";
import Users from "./Admin/Users";
// import ScreensAndSeats from "./Admin/ScreensAndSeats";
import MovieBite from "./Admin/MovieBite";
import MovieSetup from "./Admin/MovieSetup";
import MovieFormWithCrewCast from "./Movie/MovieForm";
import CrewCastList from "./CrewAndCast/CrewCastList";
import MovieCrewCast from "./Movie/MovieCrewAndCast";
import EditCrewCast from "./CrewAndCast/EditCrewAndCast";
import { ScreenForm } from "./component/Screens/ScreenForm";
import AddMovieSetup from "./component/AddMovieSetup/AddMovieSetup";
// import { ScreenSeatForm } from "./component/ScreenSeatClass/ScreenSeatForm";
import { ScreenSeatClassList } from "./component/ScreenSeatClass/ScreenSeatClassList";
import { AddScreenSeatClassForm } from "./component/ScreenSeatClass/AddScreenSeatClassForm";
import UpdateAllScreen, { UpdateSeatPriceForm } from "./component/ScreenSeatClass/UpdateSeatPriceForm";
import MovieSetupWithMovies from "./component/MovieSetup/MovieSetupWithMovies";
import { Adminsidebar } from "./component/adminn/Adminen";
import AdminNavbar from "./component/Demo/AdminNavbar";
import AdminLayout from "./AdminLayout/AdminLayout";
import HomePage from "./Home/HomePage";
import UserLayout from "./UserLayout/UserLayout";
import View from "./component/View";
// import ScreensAndSeats from "./component/ScreenSeatClass/ScreensAndSeats";
import MovieDetails from "./Movie/MovieDetails";
import BookTickets from "./component/BookTickets/BookTicket";
import TicketBooking from "./component/BookTickets/TicketBooking";
// import { ScreenSeatForm}  from "./component/Screen/ScreenSeatForm";
import ScreensAndSeats from "./component/Screen/ScreensAndSeats";
import { ViewScreen } from "./component/Screen/ViewScreen";
import SeatSelection from "./component/SeatSelection/SeatSelection";
import UpdateScreen from "./component/Screen/UpdateScreen";
import MovieBiteList from "./component/MovieBite/MovieBiteList";
import AddMovieBite from "./component/MovieBite/AddMovieBite";
import ScreenSeatForm  from "./component/Screen/ScreenSeatForm";
import PaymentPage from "./component/PaymentPage/PaymentPage";
import SnackSelection from "./component/MovieBitePage";
import BookingSummary from "./component/BookingSummary";
import BookingSuccess from "./component/BookingSuccess";
import ReviewForm from "./component/Review/ReviewForm";
import UserBookingHistory from "./component/UserHistory/UserBookingHistory";
import BookingHistory from "./Admin/Users";
import PrivateRoute from "./component/PrivateRoute";
import MovieSetupList from "./component/MovieSetup/MovieSetupList";


// import AdminLayout from './AdminLayout'; // import your new layout

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/viewscreen/:screenId" element={<ViewScreen/>}/>
        {/* <Route path="/" element={<h1>Welcome to ExpressCinema</h1>} /> */}
        <Route path="/signup" element={<UserRegisterForm />} />
        <Route path="/login" element={<UserLogin />} />
        {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}

        <Route path="/movie" element={<AddMovieForm />} />
        
        <Route path="/" element={<UserLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="/movies" element={<HomePage/>}/>
                <Route path="/movie/:movieId" element={<MovieDetails />} />
                {/* <Route path="/movie/:movieId/book" element={<BookTickets/>} /> */}
                <Route path="/movie/:movieId/book" element={<TicketBooking />} />
                // src/App.jsx or wherever you define routes
                <Route path="/book-seats/:movieId/:screenId/:date/:showtime" element={<SeatSelection />} />
                <Route path="/moviebitepage" element={<SnackSelection />} />
                <Route path="/bookingsummary" element={<BookingSummary />} />
                <Route path="/bookingsuccess" element={<BookingSuccess />} />
                <Route path="/reviewform" element={<ReviewForm />} />
                <Route path="/bookings" element={<UserBookingHistory />} />
                <Route path="/payment" element={<PaymentPage />} />
                </Route>
        {/* Admin routes wrapped with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Movies />} /> {/* default admin page at /admin */}
          <Route path="movies" element={<Movies />} />
          <Route path="users" element={<BookingHistory />} />
          {/* <Route path="screens" element={<ScreensAndSeats />} /> */}
          <Route path="moviesetuplist/add" element={<MovieSetupWithMovies />} />
          <Route path="moviesetuplist/edit/:movieSetupId" element={<MovieSetupWithMovies />} />
          UpdateMovieSetupForm
           <Route path="moviesetuplist" element={<MovieSetupList />} /> 

<Route path="moviebite" element={<MovieBiteList />} />
<Route path="moviebite/add" element={<AddMovieBite />} />
<Route path="moviebite/edit/:biteId" element={<AddMovieBite />} />

    
          <Route path="moviesetup" element={<MovieSetup />} />
          <Route path="movies/add" element={<MovieFormWithCrewCast />} />
          <Route path="/admin/movies/edit/:movieId" element={<MovieFormWithCrewCast />} />
          <Route path="screens/add" element={<ScreenSeatForm/>}/>
          <Route path="screens/viewscreen/:id" element={<ViewScreen/>}/>
          {/* <Route path="/admin/movie-form/:movieId" element={<MovieFormWithCrewCast />} /> */}
          // src/App.jsx or wherever you define routes
          //AddMovieBite
          



          <Route path="movies/:movieId/setup" element={<MovieSetup />} />
          <Route path="movies/:movieId/crew-cast" element={<MovieCrewCast />} />
          <Route path="movies/:movieId/crewAndCast/edit/:member_id" element={<EditCrewCast />} />
          <Route path="crew-cast/edit/:memberId" element={<EditCrewCast />} />
          {/* <Route path="screens/add" element={<ScreenSeatForm />} /> */}
          {/* //<Route path="screens/edit/:screenId" element={<UpdateAllScreen />} /> */}
          <Route path="screenseatclasses" element={<ScreenSeatClassList />} />
          <Route path="screens" element={<ScreensAndSeats/>}/>
          {/* <Route path="screens/update/:screenId" element={<ScreenSeatForm />} /> */}
          <Route path="screens/update/:id" element={<UpdateAllScreen />} />


          {/* Add other admin child routes here */}
        </Route>
        {/* </Route> */}

        {/* Non-admin routes */}
        {/* <Route path="/create-screen" element={<ScreenForm />} /> */}
        <Route path="/update-screen/:screenId" element={<ScreenForm />} />
        <Route path='movies/:movieId/setup' element={<AddMovieSetup/>}/>
        <Route path="/view" element={<View/>} />

        {/* <Route path="/adminnn" element={<Adminsidebar />} /> */}
        {/* <Route path="/hh" element={<AdminNavbar />} /> */}

        {/* Catch all */}
        <Route path="" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
