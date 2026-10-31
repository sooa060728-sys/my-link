import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLinksFromFirestore,
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from '@/lib/firebase';
import { LinkItem } from '@/types';

/**
 * 사용자별 링크 목록 조회 TanStack Query 훅 (단발성 Fetch / 캐싱)
 * Firestore 실시간 onSnapshot 대신 TanStack Query 캐시 관리
 */
export function useLinksQuery(userId?: string) {
  return useQuery<LinkItem[]>({
    queryKey: ['links', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getLinksFromFirestore(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 3, // 3분간 캐시 신선도 유지
  });
}

/**
 * 링크/헤더 블록 추가 Mutation 훅
 */
export function useAddLinkMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLink: LinkItem) => {
      return await addLinkToFirestore(newLink, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    },
  });
}

/**
 * 링크 정보 수정 Mutation 훅
 */
export function useUpdateLinkMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LinkItem> }) => {
      return await updateLinkInFirestore(id, updates, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    },
  });
}

/**
 * 링크 삭제 Mutation 훅
 */
export function useDeleteLinkMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteLinkFromFirestore(id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userId] });
    },
  });
}
