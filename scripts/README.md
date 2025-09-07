# Deployment Scripts

## 개발 → 운영 배포 프로세스

### 1. 개발 PC에서 (자동)
- `main` 브랜치에 푸시하면 GitHub Actions가 자동으로:
  - Frontend/Backend 빌드
  - `production` 브랜치에 빌드 파일 커밋 및 푸시

### 2. 라즈베리파이에서 (수동)
```bash
# 최신 배포 버전 가져오기
git fetch origin
git checkout production
git pull origin production

# 배포 실행
./scripts/deploy-pi.sh
```

## 스크립트 설명

### `deploy-pi.sh`
라즈베리파이에서 실행하는 배포 스크립트:
- Frontend: `/var/www/asset-manager/`로 복사
- Backend: PM2로 재시작
- Nginx: 설정 리로드
- 상태 확인 및 로그

## 트러블슈팅

### GitHub Actions 실패 시
- Node.js 버전 호환성 확인
- 빌드 에러 로그 확인
- 메모리 부족 시 NODE_OPTIONS 조정

### 배포 실패 시
```bash
# PM2 로그 확인
pm2 logs asset-manager-backend

# Nginx 설정 테스트
sudo nginx -t

# 메모리 확인
free -h
```

### 롤백 방법
```bash
# 이전 커밋으로 롤백
git log --oneline -5  # 최근 5개 커밋 확인
git checkout [커밋해시]
./scripts/deploy-pi.sh
```