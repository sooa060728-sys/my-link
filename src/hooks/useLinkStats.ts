import { useQuery } from '@tanstack/react-query';
import { getLinksByClicksFromFirestore } from '@/lib/firebase';
import { LinkItem } from '@/types';

export const getLinkStatsQueryKey = (userId?: string | null) => ['link-stats', userId ?? 'anonymous'];

/**
 * 통계 페이지용 링크 목록 조회 훅
 * - Firestore orderBy('clicks', 'desc')로 클릭수 많은 순서대로 가져옵니다.
 * - 로그인한 사용자(userId)가 있을 때만 실행됩니다.
 */
export function useLinkStatsQuery(userId?: string | null) {
  return useQuery<LinkItem[]>({
    queryKey: getLinkStatsQueryKey(userId),
    queryFn: () => getLinksByClicksFromFirestore(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30초 동안 캐시 유지 (창으로 돌아오면 다시 불러옴)
  });
}
