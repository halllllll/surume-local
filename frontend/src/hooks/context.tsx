import {
	type FC,
	type ReactNode,
	createContext,
	useContext,
	useReducer,
	useMemo,
} from "react";
import { ContextError } from "@/errors/errors";
import type { ChatMemberData, FormatedChatMessageData } from "@/types/types";
import type { ChatsAPIResponse } from "@/service/chats/type";

// context state
export type SurumeCtx = {
	client_id: string;
	authority: string;
	redirect_uri_localhost_port: string;
	redirect_uri_fqdn: string;
	accessToken: string;
	chat_messages: FormatedChatMessageData[];
	chat_list_result: {
		count: number | null | undefined;
		result: NonNullable<ChatsAPIResponse["value"]>;
	} | null;
	// chat_member_sanitize_for_workbook: string; // TODO: type
	chat_members: Map<string, ChatMemberData[]>;
} | null;

// context dispatch
export type SetSurumeCtx = React.Dispatch<ctxAction>;

const SurumeContext = createContext<SurumeCtx>(null);
const SetSurumeContext = createContext<SetSurumeCtx>(() => null);

// contxt action
type ctxAction =
	| {
			type: "SetAccessToken";
			payload: { accessToken: string };
	  }
	| {
			type: "SetEntraIdInfo";
			payload: {
				authority: string;
				clientid: string;
				port: number;
			};
	  }
	| {
			type: "SetChatsMessage";
			payload: FormatedChatMessageData[];
	  }
	| {
			type: "ResetChatsMessages";
	  }
	| {
			type: "SetBelongingChat";
			payload: {
				count: number | null | undefined;
				result: NonNullable<ChatsAPIResponse["value"]>;
			};
	  }
	| {
			type: "ResetBelongingChat";
	  }
	| {
			type: "UpdateSendingChatStatus";
			payload: {
				data: FormatedChatMessageData;
			};
	  }
	| {
			type: "SetChatMembers";
			payload: {
				chatId: string;
				data: Map<string, ChatMemberData[]>;
			};
	  };

// context reducer
const ctxReducer = (
	curData: NonNullable<SurumeCtx>,
	action: ctxAction,
): NonNullable<SurumeCtx> => {
	switch (action.type) {
		case "SetAccessToken": {
			return { ...(curData || {}), accessToken: action.payload.accessToken };
		}
		case "SetEntraIdInfo": {
			return {
				...(curData || {}),
				authority: action.payload.authority,
				client_id: action.payload.clientid,
				redirect_uri_localhost_port: action.payload.port.toString(),
				redirect_uri_fqdn: `http://localhost:${action.payload.port.toString()}${
					import.meta.env.VITE_AZURE_REDIRECT_URI_PATH
				}`,
			};
		}
		case "SetChatsMessage": {
			return {
				...curData,
				chat_messages: action.payload,
			};
		}
		case "ResetChatsMessages": {
			return { ...curData, chat_messages: [] };
		}
		case "SetBelongingChat": {
			return {
				...curData,
				chat_list_result: action.payload,
			};
		}
		case "ResetBelongingChat": {
			return { ...curData, chat_list_result: null };
		}
		case "UpdateSendingChatStatus": {
			const lis = curData.chat_messages;
			lis[action.payload.data.indexOrder] = action.payload.data;
			return {
				...curData,
				chat_messages: lis,
			};
		}
		case "SetChatMembers": {
			return {
				...curData,
				chat_members: action.payload.data,
			};
		}
	}
};

export const SurumeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const initial: NonNullable<SurumeCtx> = {
		accessToken: "",
		authority: "",
		client_id: "",
		redirect_uri_localhost_port: "",
		redirect_uri_fqdn: "",
		chat_messages: [],
		chat_list_result: null,
		chat_members: new Map(),
	};
	const [surumeState, surumeDispatch] = useReducer(ctxReducer, initial);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const surume = useMemo(() => {
		return { surumeState, surumeDispatch };
	}, [surumeState, surumeDispatch]);
	return (
		<SurumeContext.Provider value={surume.surumeState}>
			<SetSurumeContext.Provider value={surume.surumeDispatch}>
				{children}
			</SetSurumeContext.Provider>
		</SurumeContext.Provider>
	);
};

export const useSurumeContext = (): {
	surumeCtx: NonNullable<SurumeCtx>;
	setSurumeCtx: React.Dispatch<ctxAction>;
} => {
	const surumeCtx = useContext(SurumeContext);
	if (surumeCtx === null) {
		throw new ContextError(
			"surume context must be used within a SurumeProvider",
		);
	}

	const setSurumeCtx = useContext(SetSurumeContext);
	return { surumeCtx, setSurumeCtx };
};
