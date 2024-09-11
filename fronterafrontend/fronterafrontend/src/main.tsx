import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/login/Login";
import Error from "./routes/Error";
import MedicalCenters from "./routes/medical-centers/MedicalCenters";
import Root from "./routes/root";
import AddCenter from "./routes/medical-centers/AddCenter";
import Providers from "./routes/providers/Providers";
import AddProvider from "./routes/providers/AddProviders";
import ProvidersLayout from "./routes/providers/root";
import MedicalCentersLayout from "./routes/medical-centers/root";
import RequestSchedulesLayout from "@/routes/request-schedules/root.tsx";
import { CustomProvider } from "rsuite";
import App from "./App";
import DateDetails from "./routes/Home/date-details";
import MedicalCenter from "./routes/medical-centers/MedicalCenter";
import LocationDateDetail from "./routes/medical-centers/location-date-detail";
import RequestNotifications from "./routes/request-schedules/RequestNotifications";
import UpdateSchedule from "./routes/request-schedules/updateSchedule";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./providers/authProvider";
import AddRequest from "./routes/request-schedules/addRequest";
import Provider from "./routes/providers/provider";
import AuthGaurd from "./providers/authGaurd";
import ResetPassword from "./routes/login/ResetPassword";
import ProviderDetails from "./routes/providers/provider-details";
import BulkImportProvider from "./providers/bulkImportProvider";
import { Toaster } from "../components/ui/toaster";
import NotificationsPage from "./routes/notifications/notifications";
import httpCommon from "./helper/httpCommon";
import UpdateScheduleAdmin from "./routes/adminrequestupdate/adminRequestUpdate";
import AdminUpdateRequestLayout from "./routes/adminrequestupdate/root";
import UpdateRequest from "./routes/adminrequestupdate/UpdateRequest";
import 'bootstrap/dist/css/bootstrap.min.css';

export const authToken = localStorage.getItem("auth-token");

httpCommon.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "notifications",
        element: (
          <AuthGaurd route="ADMIN">
            <NotificationsPage />
          </AuthGaurd>
        ),
        errorElement: <Error />,
      },
      {
        path: "",
        element: <App />,
        errorElement: <Error />,
      },
      {
        path: "date-details/:date",
        element: <DateDetails />,
        errorElement: <Error />,
      },
      {
        path: "medical-centers",
        element: (
          <AuthGaurd route="ADMIN">
            <MedicalCentersLayout />
          </AuthGaurd>
        ),
        errorElement: <Error />,
        children: [
          {
            path: "",
            element: (
              <AuthGaurd route="ADMIN">
                <MedicalCenters />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "add-centers",
            element: (
              <AuthGaurd route="ADMIN">
                <AddCenter />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "details/:location/:date",
            element: (
              <AuthGaurd route="ADMIN">
                <LocationDateDetail />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: ":location/:date",
            element: (
              <AuthGaurd route="ADMIN">
                <MedicalCenter />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
        ],
      },
      {
        path: "provider-details",
        element: (
          <AuthGaurd route="ALL">
            <ProviderDetails />
          </AuthGaurd>
        ),
        errorElement: <Error />,
      },
      {
        path: "providers",
        element: (
          <AuthGaurd route="ADMIN">
            <ProvidersLayout />
          </AuthGaurd>
        ),
        errorElement: <Error />,
        children: [
          {
            path: "add-provider",
            element: (
              <AuthGaurd route="ADMIN">
                <AddProvider />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "",
            element: (
              <AuthGaurd route="ADMIN">
                {" "}
                <Providers />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "provider/:providerID",
            element: (
              <AuthGaurd route="ADMIN">
                <Provider />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "provider/calendar/details/",
            element: (
              <AuthGaurd route="ADMIN">
                <ProviderDetails />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
        ],
      },
      {
        path: "request-schedules",
        element: (
          <AuthGaurd route="ALL">
            <RequestSchedulesLayout />
          </AuthGaurd>
        ),
        errorElement: <Error />,
        children: [
          {
            path: "",
            element: (
              <AuthGaurd route="ADMIN">
                <AddRequest />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "update-schedule",
            element: (
              <AuthGaurd route="PROVIDER">
                <RequestNotifications />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "quick-update",
            element: (
              <AuthGaurd route="PROVIDER">
                <UpdateSchedule />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
        ],
      },
      {
        path: "request",
        element: (
          <AuthGaurd route="ADMIN">
            <AdminUpdateRequestLayout />
          </AuthGaurd>
        ),
        errorElement: <Error />,
        children: [
          {
            path: "find",
            element: (
              <AuthGaurd route="ADMIN">
                <UpdateScheduleAdmin />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
          {
            path: "update",
            element: (
              <AuthGaurd route="ADMIN">
                <UpdateRequest />
              </AuthGaurd>
            ),
            errorElement: <Error />,
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />,
    errorElement: <Error />,
  },
]);

export const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Toaster />
      <BulkImportProvider>
        <AuthProvider>
          <CustomProvider>
            <RouterProvider router={router} />
          </CustomProvider>
        </AuthProvider>
      </BulkImportProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
