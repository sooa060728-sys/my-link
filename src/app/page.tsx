export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-4 py-12 text-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-200">
      <main className="w-full max-w-sm sm:max-w-md rounded-3xl border border-zinc-200/80 bg-white/70 p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
        <div className="flex flex-col items-center text-center">
          {/* 프로필 이미지 / 아바타 */}
          <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg shadow-purple-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <span className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                수아
              </span>
            </div>
            {/* 온라인 상태 표시 뱃지 */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900"></span>
            </span>
          </div>

          {/* 서브 태그 */}
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
            ✨ Junior Developer
          </span>

          {/* 이름 */}
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            이수아
          </h1>

          {/* 소개글 */}
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            안녕하세요! 웹 기술로 가치 있는 사용자 경험을 만들어가는 프론트엔드 개발자입니다.
          </p>

          {/* 관심사 태그 */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Next.js", "React", "TypeScript", "Vibe Coding"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors dark:bg-zinc-800 dark:text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 구분선 */}
          <div className="my-6 h-px w-full bg-zinc-200/80 dark:bg-zinc-800" />

          {/* 링크 및 소셜 버튼 */}
          <div className="flex w-full flex-col gap-3">
            <a
              href="https://github.com/sooa060728-sys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub 프로필 방문하기
            </a>

            <a
              href="mailto:contact@example.com"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              연락하기
            </a>
          </div>
        </div>
      </main>

      {/* 푸터 카피라이트 */}
      <footer className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600">
        © {new Date().getFullYear()} 이수아. All rights reserved.
      </footer>
    </div>
  );
}
