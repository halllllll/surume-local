import { Navigate, createBrowserRouter, useRouteError } from "react-router-dom";
import { BaseLayout } from "@/layout/BaseLayout";
import { Home } from "@/layout/Home";
import { getEntraIdInfo } from "@/service/entraid_info_api/functions";
import { ChatList } from "@/layout/ChatList";
import { Fire } from "@/layout/BroadCast/Fire";
import { Post } from "@/layout/POC/Post/Post";
import { ServerError } from "@azure/msal-browser";
import { useIsAuthenticated } from "@azure/msal-react";
import type { FC, ReactNode } from "react";
import { CheckingFolder } from "@/layout/POC/ExitFolder/CheckingFolder";

function ErrorBoundary() {
	const e = useRouteError();
	if (e instanceof ServerError) {
		return <div>loading...</div>;
	}
	console.error(e);
	const err = e as Error;
	return <div>{`error: ${err.name} - ${err.message}`}</div>;
}

const EntraAuth: FC<{ children: ReactNode }> = ({ children }) => {
	const isAuthenticated = useIsAuthenticated();
	if (!isAuthenticated) return <Navigate replace to="/" />;

	return children;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <BaseLayout />,
		errorElement: <ErrorBoundary />,
		children: [
			{
				index: true,
				loader: getEntraIdInfo,
				element: <Home />,
			},
			{
				path: "/chats_list",
				element: (
					<EntraAuth>
						<ChatList />
					</EntraAuth>
				),
			},
			{
				path: "/fire",
				element: (
					<EntraAuth>
						<Fire />
					</EntraAuth>
				),
			},
			{
				path: "/post",
				element: (
					<EntraAuth>
						<Post />
					</EntraAuth>
				),
			},
			{
				path: "/isexistfolder",
				element: (
					<EntraAuth>
						<CheckingFolder />
					</EntraAuth>
				),
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
]);

export default router;
