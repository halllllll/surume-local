import { Navigate, createBrowserRouter, useRouteError } from "react-router-dom";
import { BaseLayout } from "@/layout/BaseLayout";
import { Home } from "@/layout/Home";
import { getEntraIdInfo } from "@/service/entraid_info_api/functions";
import { ChatList } from "@/layout/ChatList";
import { Fire } from "@/layout/BroadCast/Fire";
import { Post } from "@/layout/Post/Post";
import { ServerError } from "@azure/msal-browser";

function ErrorBoundary() {
	const e = useRouteError();
	if (e instanceof ServerError) {
		return <div>loading...</div>;
	}
	console.error(e);
	const err = e as Error;
	return <div>{`error: ${err.name} - ${err.message}`}</div>;
}

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
				element: <ChatList />,
			},
			{
				path: "/fire",
				element: <Fire />,
			},
			{
				path: "/post",
				element: <Post />,
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
]);

export default router;
