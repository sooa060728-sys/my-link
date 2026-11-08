import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfileFromFirestore,
  updateUserProfile,
} from '@/lib/firebase';
import { getProfileData, saveProfileData } from '@/lib/profileStorage';
import { ProfileData, SocialLinkItem } from '@/types';

/**
 * 프로필 쿼리 키 생성 헬퍼
 */
export const getProfileQueryKey = (userId?: string | null, username: string = 'demo') => [
  'profile',
  userId ? `uid-${userId}` : `guest-${username}`,
];

interface ProfileMutationContext {
  previousProfile?: ProfileData;
}

/**
 * 1. 프로필 정보 조회 쿼리 훅 (TanStack Query)
 * - Firestore 계정 정보와 localStorage의 테마/소셜 설정을 병합하여 캐싱
 */
export function useProfileQuery(
  userId?: string | null,
  username: string = 'demo',
  initialProfile?: ProfileData | null
) {
  const queryKey = getProfileQueryKey(userId, username);

  return useQuery<ProfileData>({
    queryKey,
    queryFn: async () => {
      const localData = getProfileData(username);

      if (userId) {
        try {
          const firestoreDoc = await getUserProfileFromFirestore(userId);
          if (firestoreDoc) {
            return {
              ...localData,
              name: firestoreDoc.displayName || localData.name,
              bio: firestoreDoc.bio !== undefined ? firestoreDoc.bio : localData.bio,
              avatarUrl: firestoreDoc.photoURL || localData.avatarUrl,
              username,
            };
          }
        } catch (e) {
          console.error('Firestore 유저 프로필 조회 에러:', e);
        }
      }

      return localData;
    },
    initialData: initialProfile || undefined,
    staleTime: 1000 * 60 * 3, // 3분 캐시
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * 2. 프로필 정보 & 테마 수정 Mutation 훅 (낙관적 업데이트 지원)
 */
export function useUpdateProfileMutation(userId?: string | null, username: string = 'demo') {
  const queryClient = useQueryClient();
  const queryKey = getProfileQueryKey(userId, username);

  return useMutation<
    void,
    Error,
    Partial<ProfileData>,
    ProfileMutationContext
  >({
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey });

      const previousProfile = queryClient.getQueryData<ProfileData>(queryKey);

      if (previousProfile) {
        const nextProfile: ProfileData = {
          ...previousProfile,
          ...updates,
        };
        // 1) 캐시 즉각 업데이트 (Optimistic Update)
        queryClient.setQueryData<ProfileData>(queryKey, nextProfile);

        // 2) localStorage 동기화
        try {
          saveProfileData(username, nextProfile);
        } catch (e) {
          console.error('로컬스토리지 저장 에러:', e);
        }
      }

      return { previousProfile };
    },
    mutationFn: async (updates) => {
      if (userId) {
        const fsUpdates: { displayName?: string; photoURL?: string; bio?: string } = {};
        if (updates.name !== undefined) fsUpdates.displayName = updates.name;
        if (updates.avatarUrl !== undefined) fsUpdates.photoURL = updates.avatarUrl;
        if (updates.bio !== undefined) fsUpdates.bio = updates.bio;

        if (Object.keys(fsUpdates).length > 0) {
          await updateUserProfile(userId, fsUpdates);
        }
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
        try {
          saveProfileData(username, context.previousProfile);
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
 * 3. 소셜 링크 추가/삭제/수정 Mutation 훅
 */
export function useUpdateSocialsMutation(userId?: string | null, username: string = 'demo') {
  const updateProfileMutation = useUpdateProfileMutation(userId, username);

  return {
    ...updateProfileMutation,
    addSocial: async (newSocial: SocialLinkItem, currentSocials: SocialLinkItem[] = []) => {
      return updateProfileMutation.mutateAsync({
        socials: [...currentSocials, newSocial],
      });
    },
    deleteSocial: async (socialId: string, currentSocials: SocialLinkItem[] = []) => {
      return updateProfileMutation.mutateAsync({
        socials: currentSocials.filter((s) => s.id !== socialId),
      });
    },
  };
}
