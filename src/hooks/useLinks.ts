import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLinksFromFirestore,
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeLinksFromFirestore,
  incrementLinkClickInFirestore,
} from '@/lib/firebase';
import { getProfileData, saveProfileData } from '@/lib/profileStorage';
import { LinkItem, ProfileData } from '@/types';

/**
 * 쿼리 키 생성 헬퍼
 * 로그인 사용자(userId) 또는 게스트/페르소나(username) 기반 고유 캐시 키
 */
export const getLinksQueryKey = (userId?: string | null, username: string = 'demo') => [
  'links',
  userId ? `uid-${userId}` : `guest-${username}`,
];

interface LinkMutationContext {
  previousLinks?: LinkItem[];
}

/**
 * 1. 링크 목록 조회 쿼리 훅 (TanStack Query + Firestore 실시간 동기화 하이브리드)
 * - 캐시된 링크 데이터를 즉각 반환하여 깜빡임 없는 UI 제공
 * - Firestore users/{userId}/links와 실시간 동기화하여 다중 기기/탭 동기화 지원
 * - 미로그인 게스트 모드 시 localStorage 자동 연동
 */
export function useLinksQuery(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  // Firestore 실시간 onSnapshot 리스너 -> TanStack Query 캐시 자동 주입
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks: LinkItem[]) => {
        // TanStack Query 캐시 즉시 갱신
        queryClient.setQueryData<LinkItem[]>(queryKey, firestoreLinks);

        // 오프라인 및 게스트 복귀 시 호환성을 위해 localStorage 동기화
        try {
          const profile = getProfileData(username);
          saveProfileData(username, { ...profile, links: firestoreLinks });
        } catch (e) {
          console.error('로컬스토리지 동기화 에러:', e);
        }
      },
      (error) => {
        console.error(`Firestore (users/${userId}/links) 실시간 구독 에러:`, error);
      },
      userId
    );

    return () => unsubscribe();
  }, [userId, username, queryClient, queryKey]);

  return useQuery<LinkItem[]>({
    queryKey,
    queryFn: async () => {
      // 1) 로그인 사용자인 경우 Firestore에서 조회
      if (userId) {
        const firestoreLinks = await getLinksFromFirestore(userId);
        if (firestoreLinks && firestoreLinks.length > 0) {
          return firestoreLinks;
        }
      }

      // 2) Firestore가 비어있거나 게스트 모드인 경우 localStorage 데이터 반환
      const localProfile: ProfileData = getProfileData(username);
      return localProfile.links || [];
    },
    staleTime: 1000 * 60 * 3, // 3분간 캐시 신선도 유지
    gcTime: 1000 * 60 * 10, // 10분간 메모리 보존
  });
}

/**
 * 2. 링크 추가 Mutation 훅 (낙관적 업데이트 지원)
 * - 서버 응답 대기 없이 캐시에 즉시 추가하여 0ms 반응 속도 구현
 * - 네트워크 오류 시 자동 롤백
 */
export function useAddLinkMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  return useMutation<string, Error, LinkItem, LinkMutationContext>({
    onMutate: async (newLink: LinkItem) => {
      // 진행 중인 쿼리 취소하여 낙관적 업데이트 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey });

      // 이전 캐시 상태 스냅샷 저장
      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 1) 캐시에 새 링크 즉각 추가 (Optimistic Update)
      const nextLinks = [newLink, ...previousLinks];
      queryClient.setQueryData<LinkItem[]>(queryKey, nextLinks);

      // 2) localStorage 즉시 동기화
      try {
        const profile = getProfileData(username);
        saveProfileData(username, { ...profile, links: nextLinks });
      } catch (e) {
        console.error('로컬스토리지 저장 에러:', e);
      }

      return { previousLinks };
    },
    mutationFn: async (newLink: LinkItem) => {
      if (userId) {
        return await addLinkToFirestore(newLink, userId);
      }
      return newLink.id;
    },
    onError: (_err, _newLink, context) => {
      // 오류 발생 시 이전 스냅샷으로 롤백
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
        try {
          const profile = getProfileData(username);
          saveProfileData(username, { ...profile, links: context.previousLinks });
        } catch (e) {
          console.error('로컬스토리지 롤백 에러:', e);
        }
      }
    },
    onSettled: () => {
      // 최종 서버 데이터와 일치시키기 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 3. 링크 수정 Mutation 훅 (낙관적 업데이트 지원)
 */
export function useUpdateLinkMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  return useMutation<
    void,
    Error,
    { id: string; updates: Partial<LinkItem> },
    LinkMutationContext
  >({
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 1) 낙관적 업데이트: 수정 대상 링크 즉시 갱신
      const nextLinks = previousLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      );
      queryClient.setQueryData<LinkItem[]>(queryKey, nextLinks);

      // 2) localStorage 동기화
      try {
        const profile = getProfileData(username);
        saveProfileData(username, { ...profile, links: nextLinks });
      } catch (e) {
        console.error('로컬스토리지 저장 에러:', e);
      }

      return { previousLinks };
    },
    mutationFn: async ({ id, updates }) => {
      if (userId) {
        await updateLinkInFirestore(id, updates, userId);
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
        try {
          const profile = getProfileData(username);
          saveProfileData(username, { ...profile, links: context.previousLinks });
        } catch (e) {
          console.error('로컬스토리지 롤백 에러:', e);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 4. 링크 삭제 Mutation 훅 (낙관적 업데이트 지원)
 */
export function useDeleteLinkMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  return useMutation<void, Error, string, LinkMutationContext>({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 1) 낙관적 업데이트: 대상 링크 즉시 제거
      const nextLinks = previousLinks.filter((link) => link.id !== id);
      queryClient.setQueryData<LinkItem[]>(queryKey, nextLinks);

      // 2) localStorage 동기화
      try {
        const profile = getProfileData(username);
        saveProfileData(username, { ...profile, links: nextLinks });
      } catch (e) {
        console.error('로컬스토리지 저장 에러:', e);
      }

      return { previousLinks };
    },
    mutationFn: async (id: string) => {
      if (userId) {
        await deleteLinkFromFirestore(id, userId);
      }
    },
    onError: (_err, _id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
        try {
          const profile = getProfileData(username);
          saveProfileData(username, { ...profile, links: context.previousLinks });
        } catch (e) {
          console.error('로컬스토리지 롤백 에러:', e);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 5. 링크 순서 변경 (Up/Down) Mutation 훅
 */
export function useReorderLinksMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  return useMutation<void, Error, LinkItem[], LinkMutationContext>({
    onMutate: async (newLinks: LinkItem[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 1) 캐시 즉시 업데이트
      queryClient.setQueryData<LinkItem[]>(queryKey, newLinks);

      // 2) localStorage 동기화
      try {
        const profile = getProfileData(username);
        saveProfileData(username, { ...profile, links: newLinks });
      } catch (e) {
        console.error('로컬스토리지 저장 에러:', e);
      }

      return { previousLinks };
    },
    mutationFn: async (_newLinks: LinkItem[]) => {
      // Firestore는 createdAt 기준 정렬이 기본이므로, 순서 변경 시 localStorage에 저장 유지
      return;
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
        try {
          const profile = getProfileData(username);
          saveProfileData(username, { ...profile, links: context.previousLinks });
        } catch (e) {
          console.error('로컬스토리지 롤백 에러:', e);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 6. 링크 공개/비공개 활성화 토글 Mutation 훅
 */
export function useToggleActiveMutation(userId?: string | null, username: string = 'demo') {
  const updateMutation = useUpdateLinkMutation(userId, username);

  return {
    ...updateMutation,
    toggleActive: (link: LinkItem) => {
      const newActiveState = !link.isActive;
      const now = new Date().toISOString();
      return updateMutation.mutateAsync({
        id: link.id,
        updates: {
          isActive: newActiveState,
          updatedAt: now,
        },
      });
    },
  };
}

/**
 * 7. 링크 클릭 카운트 기록 Mutation 훅
 * - 낙관적 업데이트로 UI 즉시 반영 (0ms 반응 속도)
 * - 로그인 사용자: Firestore에 increment(1) 원자적 저장
 * - 게스트 모드: localStorage에 직접 카운트 저장
 * - 오류 발생 시 조용히 무시 (클릭 카운팅은 non-critical 작업)
 */
export function useRecordLinkClickMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getLinksQueryKey(userId, username);

  return useMutation<void, Error, string>({
    onMutate: async (linkId: string) => {
      await queryClient.cancelQueries({ queryKey });

      // 낙관적 업데이트: 캐시에서 해당 링크의 clicks를 즉시 +1
      queryClient.setQueryData<LinkItem[]>(queryKey, (prev) =>
        (prev || []).map((link) =>
          link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
        )
      );

      // localStorage 즉시 동기화
      try {
        const profile = getProfileData(username);
        const updatedLinks = profile.links.map((link) =>
          link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
        );
        saveProfileData(username, { ...profile, links: updatedLinks });
      } catch (e) {
        console.error('클릭 카운트 localStorage 저장 에러:', e);
      }
    },
    mutationFn: async (linkId: string) => {
      if (userId) {
        // 로그인 사용자: Firestore에 원자적 increment
        await incrementLinkClickInFirestore(linkId, userId);
      }
      // 게스트 모드: onMutate에서 localStorage를 이미 업데이트함
    },
    onError: (err) => {
      // 클릭 카운팅 실패는 조용히 처리 (사용자 경험 방해 없음)
      console.error('클릭 카운트 저장 실패:', err);
    },
    // 성공 시 쿼리 무효화는 하지 않음 — Firestore onSnapshot이 자동으로 최신 값을 반영해줌
  });
}
