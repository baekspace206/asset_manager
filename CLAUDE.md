# Claude Code 프로젝트 컨텍스트

## 프로젝트 개요
- **이름**: Asset Manager - 완전한 재정 관리 스위트
- **타입**: Full-stack 자산 관리 애플리케이션
- **상태**: 프로덕션 운영 중

## 기술 스택
- **Backend**: NestJS + TypeScript + TypeORM + SQLite
- **Frontend**: React + TypeScript
- **인프라**: Nginx (reverse proxy) + PM2 (process manager)
- **환경**: Raspberry Pi (저사양 환경)

## 주요 기능
1. **자산 포트폴리오 관리**: 실시간 추적, 분석, 감사 로깅
2. **가계부 시스템**: 월별 지출 추적, 카테고리별 시각화
3. **사용자 관리**: 역할 기반 접근 제어, 승인 워크플로
4. **모던 UX**: 반응형 디자인, 실시간 업데이트

## 현재 운영 상태

### 서버 인프라
- **Nginx**: 포트 80, 정상 가동 중
  - 설정 파일: `/etc/nginx/sites-available/asset-manager`
  - React 앱: `/var/www/asset-manager/`
  - API 프록시: `/api/*` → `localhost:3000`

- **PM2**: `asset-manager-backend` 프로세스 관리
  - PID: 843, 23시간+ 가동 중
  - 메모리 사용량: ~92MB
  - 로그: `pm2 logs asset-manager-backend`

### 메모리 및 시스템
- **RAM**: 906MB (Raspberry Pi)
- **Swap**: 512MB (`/var/swap`)
- **알려진 이슈**: React 빌드 시 메모리 부족
- **해결책**: `NODE_OPTIONS="--max-old-space-size=2048" npm run build`

## 기본 계정
- **관리자**: `jaemin` / `admin123`
- **테스트**: `test` / `test123` (VIEW 권한)

## 자주 사용하는 명령어

### 개발
```bash
npm run dev                    # 개발 모드 (frontend:3001, backend:3000)
npm run backend:dev           # 백엔드만
npm run frontend:dev          # 프론트엔드만
```

### 프로덕션 빌드
```bash
# 메모리 최적화된 빌드
cd apps/frontend
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# 배포
sudo cp -r build/* /var/www/asset-manager/
sudo systemctl reload nginx
```

### 서버 관리
```bash
# PM2
pm2 list
pm2 logs asset-manager-backend
pm2 restart asset-manager-backend

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# 시스템 모니터링
free -h
swapon --show
```

## 현재 알려진 이슈
- SQLite 에러 발생: `LedgerService.getMonthlyStats`에서 SQLITE_ERROR
- 서비스는 정상 가동 중이나 일부 DB 쿼리에서 에러 발생

## Git 상태
- 브랜치: `main`
- origin/main보다 4개 커밋 앞섬 (push 필요)
- 최근 커밋: docs, 가계부 시스템, 포트폴리오 관리 개선

## 프로젝트 구조
```
apps/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # 인증 시스템
│   │   ├── users/       # 사용자 관리
│   │   ├── assets/      # 자산 관리
│   │   ├── ledger/      # 가계부 시스템
│   │   └── portfolio/   # 포트폴리오 분석
└── frontend/            # React App
    └── src/
        ├── components/  # UI 컴포넌트
        ├── contexts/    # 상태 관리
        └── services/    # API 통신
```

---
**참고**: 이 파일은 Claude Code와의 효율적인 대화를 위한 컨텍스트 정보입니다.