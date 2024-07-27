import { DownloadTemplateXlsxButton } from "@/component/button/DownloadTemplateXlsx";
import { BaseCard2 } from "@/component/card/Base";
import { ErrorFallback } from "@/errors/ErrorFallback";
import { SimpleGrid, Box, Container } from "@chakra-ui/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";

export const ManageRoot: FC = () => {
	return (
		<>
			<Container>
				<SimpleGrid
					minChildWidth="120px"
					textAlign={"left"}
					justifyContent={"center"}
					alignContent={"center"}
					spacing="10"
					rounded={"lg"}
					fontWeight={"bold"}
				>
					<QueryErrorResetBoundary>
						{({ reset }) => (
							<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
								<Suspense fallback={<b>Loading...</b>}>
									<DownloadTemplateXlsxButton />
									<Link to={"/chats_list"}>
										<BaseCard2>Belonging Chats List</BaseCard2>
									</Link>
									<Link to={"/fire"}>
										<BaseCard2>Fire</BaseCard2>
									</Link>
									<Link to={"/member"}>
										<BaseCard2>Chat Members</BaseCard2>
									</Link>
									<Link to={"/logs"}>
										<BaseCard2>Chat Logs</BaseCard2>
									</Link>
									<Link to={"/post"}>
										<BaseCard2>Manual Post(for POC)</BaseCard2>
									</Link>
									<Link to={"/isexistfolder"}>
										<BaseCard2>Check Exist Folder(for POC)</BaseCard2>
									</Link>
									<Box bg="tomato" height={100} />
									<Box bg="tomato" height={100} />
									<Box bg="tomato" height={100} />
									<Box bg="tomato" height={100} />
									<Box bg="tomato" height={100} />
									<Box bg="tomato" height={100} />
								</Suspense>
							</ErrorBoundary>
						)}
					</QueryErrorResetBoundary>
				</SimpleGrid>
			</Container>
		</>
	);
};
