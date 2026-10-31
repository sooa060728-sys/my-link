import { z } from 'zod';

// 1. 링크/헤더 블록 추가 및 수정 Zod 스키마
export const blockSchema = z
  .object({
    blockType: z.enum(['link', 'header']),
    title: z
      .string()
      .trim()
      .min(1, { message: '제목을 입력해 주세요.' })
      .max(50, { message: '제목은 50자 이하로 입력해 주세요.' }),
    url: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.blockType === 'link') {
      const rawUrl = data.url?.trim() || '';
      if (!rawUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'URL 주소를 입력해 주세요.',
          path: ['url'],
        });
        return;
      }
      if (/^(javascript|data|vbscript):/i.test(rawUrl)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '허용되지 않는 위험한 프로토콜입니다.',
          path: ['url'],
        });
        return;
      }
      let targetUrl = rawUrl;
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }
      try {
        const parsed = new URL(targetUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '올바른 웹사이트 URL 주소를 입력해 주세요. (예: https://example.com)',
            path: ['url'],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 웹사이트 URL 주소를 입력해 주세요. (예: https://example.com)',
          path: ['url'],
        });
      }
    }
  });

export type BlockFormValues = z.infer<typeof blockSchema>;

// 2. 프로필 정보 및 테마 설정 Zod 스키마
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: '닉네임(Display Name)은 2자 이상이어야 합니다.' })
    .max(20, { message: '닉네임(Display Name)은 20자 이하로 입력해 주세요.' })
    .regex(/^[a-zA-Z0-9가-힣_\-\s()]+$/, {
      message: '한글, 영문, 숫자, 언더바(_), 하이픈(-), 괄호(), 공백만 사용할 수 있어요.',
    }),
  bio: z
    .string()
    .max(150, { message: '한줄 소개는 150자 이하로 작성해 주세요.' })
    .optional(),
  avatarUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || !val.trim()) return true;
        const trimmed = val.trim();
        if (/^(javascript|data|vbscript):/i.test(trimmed)) return false;
        let target = trimmed;
        if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
        try {
          const parsed = new URL(target);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: '올바른 아바타 이미지 URL 주소를 입력해 주세요. (http:// 또는 https://)' }
    ),
  theme: z.enum(['light', 'dark', 'neon', 'pastel', 'minimal', 'gradient']),
  buttonStyle: z.enum(['rounded', 'corner', 'outline']),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// 3. 소셜 매체 링크 추가 Zod 스키마
export const socialSchema = z
  .object({
    platform: z.enum(['instagram', 'youtube', 'github', 'twitter', 'email', 'website']),
    url: z.string().trim().min(1, { message: '소셜 URL 주소 또는 이메일을 입력해 주세요.' }),
  })
  .superRefine((data, ctx) => {
    const raw = data.url.trim();
    if (/^(javascript|data|vbscript):/i.test(raw)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '허용되지 않는 위험한 프로토콜입니다.',
        path: ['url'],
      });
      return;
    }
    if (data.platform === 'email') {
      const cleanEmail = raw.replace(/^mailto:/i, '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 이메일 형식을 입력해 주세요. (예: contact@example.com)',
          path: ['url'],
        });
      }
    } else {
      let target = raw;
      if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
      try {
        const parsed = new URL(target);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '올바른 소셜 웹사이트 URL 주소를 입력해 주세요.',
            path: ['url'],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 소셜 웹사이트 URL 주소를 입력해 주세요.',
          path: ['url'],
        });
      }
    }
  });

export type SocialFormValues = z.infer<typeof socialSchema>;

// 4. 커스텀 핸들(Username) 생성 Zod 스키마
export const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: '핸들은 3자 이상이어야 합니다.' })
    .max(20, { message: '핸들은 20자 이하이어야 합니다.' })
    .regex(/^[a-z0-9_]+$/i, { message: '핸들은 영문 소문자, 숫자, 언더바(_)만 가능합니다.' }),
});

export type UsernameFormValues = z.infer<typeof usernameSchema>;
