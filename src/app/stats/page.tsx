'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { BarChart3, Loader2, MousePointerClick, Link as LinkIcon, Trophy, AlertCircle } from 'lucide-react';

import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useLinkStatsQuery } from '@/hooks/useLinkStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  clicks: {
    label: '클릭수',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

// 차트에 표시할 최대 링크 개수
const MAX_CHART_ITEMS = 10;

const truncate = (text: string, max = 10) => (text.length > max ? `${text.slice(0, max)}…` : text);

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 로그인 필수: 인증 확인이 끝났는데 로그인하지 않았다면 홈(로그인 페이지)으로 이동
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // Firestore에서 orderBy('clicks', 'desc')로 정렬된 링크 목록
  const { data: links = [], isLoading, isError } = useLinkStatsQuery(user?.uid);

  // 구분선(헤더 블록)은 클릭할 수 없으므로 통계에서 제외
  const clickableLinks = useMemo(() => links.filter((l) => !l.isHeader), [links]);

  // 총 클릭수 (모든 링크 합산)
  const totalClicks = useMemo(
    () => clickableLinks.reduce((sum, l) => sum + (l.clicks || 0), 0),
    [clickableLinks]
  );

  const chartData = useMemo(
    () =>
      clickableLinks.slice(0, MAX_CHART_ITEMS).map((l) => ({
        title: l.title || l.url || '제목 없음',
        clicks: l.clicks || 0,
      })),
    [clickableLinks]
  );

  const topLink = clickableLinks[0];

  // 인증 확인 중이거나 리다이렉트 대기 중
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased">
        <Header />
        <main className="py-16 px-4 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3182F6] mx-auto" />
          <p className="text-sm font-semibold text-[#6B7684]">
            {authLoading ? '로그인 정보를 확인하고 있어요...' : '로그인 페이지로 이동하고 있어요...'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased">
      <Header />

      <main className="mx-auto max-w-xl px-4 pt-6 pb-24 space-y-4">
        {/* 페이지 제목 */}
        <div className="flex items-center gap-2 px-1">
          <BarChart3 className="w-5 h-5 text-[#3182F6]" />
          <h1 className="text-xl font-extrabold tracking-tight">링크 통계</h1>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-3xl bg-white tds-shadow-1">
            <CardContent className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#8B95A1]">
                <MousePointerClick className="w-3.5 h-3.5" />
                총 클릭수
              </div>
              <div className="text-3xl font-extrabold text-[#191F28] tabular-nums">
                {isLoading ? '–' : totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-[#8B95A1]">모든 링크 합산</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl bg-white tds-shadow-1">
            <CardContent className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#8B95A1]">
                <LinkIcon className="w-3.5 h-3.5" />
                링크 수
              </div>
              <div className="text-3xl font-extrabold text-[#191F28] tabular-nums">
                {isLoading ? '–' : clickableLinks.length.toLocaleString()}
              </div>
              <p className="text-xs text-[#8B95A1] truncate">
                {topLink && (topLink.clicks || 0) > 0 ? (
                  <>
                    <Trophy className="inline w-3 h-3 mr-1 text-[#FFC342]" />
                    1위 {topLink.title}
                  </>
                ) : (
                  '아직 클릭이 없어요'
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 링크별 클릭수 차트 */}
        <Card className="rounded-3xl bg-white tds-shadow-1">
          <CardHeader>
            <CardTitle className="font-bold">링크별 클릭수</CardTitle>
            <CardDescription>
              클릭수 많은 순서{clickableLinks.length > MAX_CHART_ITEMS ? ` · 상위 ${MAX_CHART_ITEMS}개` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#3182F6]" />
              </div>
            ) : isError ? (
              <div className="py-10 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-[#F04452] mx-auto" />
                <p className="text-sm text-[#4E5968]">통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <p className="text-sm text-[#4E5968]">아직 등록된 링크가 없어요.</p>
                <Link href="/my" className="inline-block text-sm font-bold text-[#3182F6] hover:underline">
                  링크 추가하러 가기
                </Link>
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto w-full"
                style={{ height: Math.max(chartData.length * 44, 120) }}
              >
                <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="title"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                    tickFormatter={(value: string) => truncate(value)}
                  />
                  <XAxis dataKey="clicks" type="number" allowDecimals={false} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={6}>
                    <LabelList
                      dataKey="clicks"
                      position="right"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
