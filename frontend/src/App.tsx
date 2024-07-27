import { useMsal } from "@azure/msal-react";
import { Box } from "@chakra-ui/react";
import { BaseLayout } from "./layout/BaseLayout";

function App() {
	const mtx = useMsal();
	console.log(mtx.accounts, mtx.inProgress, mtx.instance, mtx.logger);
	return (
		<Box mx={"10"} p={"10"}>
			<BaseLayout />
		</Box>
	);
}

export default App;
