import { Navigate, createBrowserRouter, useRouteError } from "react-router-dom";
import { BaseLayout } from "@/layout/BaseLayout";
import { Home } from "@/layout/Home";
import { LoginRoot } from "@/view/LoginRoot";
import { getEntraIdInfo } from "@/service/entraid_info_api/functions";
import { ChatList } from "@/layout/ChatList";
import { Fire } from "@/layout/BroadCast/Fire";
import { Post } from "@/layout/Post/Post";

function ErrorBoundary() {
  const err = useRouteError() as Error;
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
    path: "/login",
    element: <LoginRoot />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
