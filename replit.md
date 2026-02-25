# 라이나ON - 보험 후기 커뮤니티 프로토타입

## Overview
보험금 청구 및 상품 후기 공유 커뮤니티 "라이나ON"의 모바일 웹앱 프로토타입.
React + TypeScript SPA로 구현. 클라이언트 사이드 데이터 관리 (데이터베이스 미사용 프로토타입).

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS (모바일 퍼스트 480px 컨테이너)
- **Backend**: Express (정적 파일 서빙만, API 없음)
- **Data**: 클라이언트 메모리 저장 (`client/src/lib/feedData.ts`)
- **Routing**: SPA 화면 전환 (App.tsx에서 state 기반 관리)

## Key Files
- `client/src/App.tsx` - 메인 앱, SPA 화면 전환 관리
- `client/src/lib/feedData.ts` - 피드 데이터 타입 및 초기 더미 데이터
- `client/src/lib/balanceGameData.ts` - 밸런스 게임 5개 데이터 (자산관리, 주거형태, 건강관리, 인간관계, 인생기회)
- `client/src/pages/MainFeed.tsx` - 메인 피드 (배너, 베스트, 밸런스 게임, 탭/필터 피드)
- `client/src/pages/SubjectSelect.tsx` - 후기 작성 대상 선택 (보트 시트 모달)
- `client/src/pages/ReviewEditor.tsx` - 후기 에디터 (별점, 태그, 텍스트, 약관 동의)
- `client/src/pages/ReviewDetail.tsx` - 후기 상세 보기
- `client/src/pages/BalanceGameDetail.tsx` - 밸런스 게임 상세 (카드 슬라이더, 플립 투표, 댓글)
- `client/src/pages/MyPage.tsx` - 나의 이야기 (프로필 + 메뉴 4개)
- `client/src/pages/MyReviews.tsx` - 내가 작성한 리뷰 (보상/가입 후기 탭 + 밸런스 게임 탭)
- `client/src/pages/PushSettings.tsx` - Push 알림 설정 (5개 토글)
- `client/src/pages/ServicePolicy.tsx` - 서비스 운영정책
- `client/src/pages/Terms.tsx` - 이용약관

## User Flow
1. 메인 피드 → "이야기 쓰기" 버튼 → 대상 선택
2. 대상 선택 → 보상 후기/상품 후기 선택 → 에디터
3. 에디터 → 별점/태그/본문 입력 → 등록 → 메인 피드 (새 글 최상단)
4. 피드 카드 클릭 → 상세 보기
5. 밸런스 게임 카드 클릭 → 게임 상세 (투표 → 플립 결과 → 댓글) → 뒤로가기
6. 프로필 아이콘 → MyPage → (MyReviews | PushSettings | ServicePolicy | Terms) → 뒤로가기 → MyPage → 메인 피드

## Features
- 오토타이핑: 텍스트 영역 포커스 시 자동 입력 (시연용)
- 별점 1-2점: 부정 모드 UI, 3-5점: 긍정 모드 UI
- 필수 입력 검증: 별점 + 태그 + 텍스트(10자 이상) + 약관 동의 시 등록 가능
- 밸런스 게임: 5개 게임 카드 슬라이더, A/B 투표 시 플립 애니메이션, 결과 바 차트, 댓글 정렬(최신/인기) 및 필터(전체/A/B)
