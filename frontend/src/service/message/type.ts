import type { components } from '@/types/oas';

// https://learn.microsoft.com/ja-jp/graph/api/resources/chatmessage?view=graph-rest-1.0
export type ChatMessage = components['schemas']['microsoft.graph.chatMessage'];

export type GraphOdataError = components['schemas']['microsoft.graph.ODataErrors.ODataError'];
export type GraphMainError = components['schemas']['microsoft.graph.ODataErrors.MainError'];
