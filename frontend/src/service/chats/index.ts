import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getChats } from './functions';
import type { ChatsAPIResponse } from './type';

export const useGetChatsPaginate = () => {
  const {
    data,
    refetch,
    isPending,
    hasNextPage,
    fetchNextPage,
    isError,
    isFetching,
    isLoading,
    error,
  } = useSuspenseInfiniteQuery({
    networkMode: 'offlineFirst',
    retry: 3,
    retryOnMount: false,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // TODO: defaultだと不要らしいのであとで消す
    queryKey: ['chat pagenates'],
    queryFn: ({ pageParam }) => {
      return getChats(pageParam);
    },
    select: (data) => {
      const result = data.pages.map((v) => {
        return v.value?.map((vv) => {
          return {
            type: vv.chatType,
            id: vv.id,
            topic: vv.topic,
            createdat: vv.createdDateTime,
            updatedat: vv.lastUpdatedDateTime,
            url: vv.webUrl,
          };
        });
      });

      return {
        count: data.pages
          .map((v) => v['@odata.count'])
          .reduce((pre, cur) => pre && cur && pre + cur),
        result: result.flat(),
      };
    },
    getNextPageParam: (lastPage: ChatsAPIResponse) => {
      const ret = lastPage['@odata.nextLink'];
      return ret;
    },
    initialPageParam: '',
  });

  return {
    data,
    refetch,
    isPending,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  };
};
