import { RouterProvider } from "react-router-dom";
import router from "../routes/route";

export const ReactRouterProvider = () => {
	return <RouterProvider router={router} />;
};
