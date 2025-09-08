# 배포 자동화 가이드

이 프로젝트는 라즈베리파이 환경에서의 자동 배포를 지원합니다.

## 🚀 자동 배포 시스템

### 1. GitHub Actions 워크플로
- `main` 브랜치에 푸시할 때마다 자동으로 실행
- 프론트엔드와 백엔드를 빌드하고 `production` 브랜치에 커밋
- (선택사항) 라즈베리파이에 SSH로 자동 배포

### 2. 라즈베리파이 배포 스크립트
`deploy.sh` 스크립트가 다음 작업을 자동으로 수행합니다:
- 최신 코드 pull
- 의존성 설치
- 프론트엔드 빌드 (메모리 최적화)
- 기존 파일 백업
- 새 파일 배포
- PM2와 Nginx 재시작
- 상태 확인

## 🔧 설정 방법

### 라즈베리파이 초기 설정

1. **저장소 클론**
   ```bash
   cd /home/pi
   git clone https://github.com/baekspace206/asset_manager.git
   cd asset_manager
   ```

2. **배포 스크립트 권한 설정**
   ```bash
   chmod +x deploy.sh
   ```

3. **필요한 디렉토리 생성**
   ```bash
   sudo mkdir -p /var/www/asset-manager
   sudo mkdir -p /var/backups/asset-manager
   sudo chown -R www-data:www-data /var/www/asset-manager
   ```

### GitHub Secrets 설정 (자동 배포용)

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가하세요:

- `DEPLOY_HOST`: 라즈베리파이 IP 주소
- `DEPLOY_USER`: SSH 사용자명 (보통 `pi`)
- `DEPLOY_SSH_KEY`: SSH 개인키 (private key)
- `DEPLOY_PORT`: SSH 포트 (기본값 22, 생략 가능)

### SSH 키 생성 (필요한 경우)

라즈베리파이에서:
```bash
ssh-keygen -t rsa -b 4096 -C "deployment@asset-manager"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

생성된 `~/.ssh/id_rsa` 파일의 내용을 `DEPLOY_SSH_KEY` secret에 추가하세요.

## 📋 배포 방법

### 자동 배포 (GitHub Actions 설정 완료 시)
```bash
git push origin main
```
푸시하면 자동으로 빌드되고 배포됩니다.

### 수동 배포 (라즈베리파이에서)
```bash
cd /home/pi/asset_manager
git fetch origin
git checkout production
git pull origin production
./deploy.sh
```

### 개발용 배포 (main 브랜치)
```bash
cd /home/pi/asset_manager
git pull origin main
./deploy.sh
```

## 🔍 배포 상태 확인

```bash
# PM2 프로세스 상태
pm2 list

# PM2 로그
pm2 logs asset-manager-backend

# Nginx 상태
sudo systemctl status nginx

# 시스템 리소스
free -h
df -h

# 백엔드 연결 테스트
curl http://localhost:3000

# 프론트엔드 접속 테스트
curl http://localhost
```

## 🛠️ 문제 해결

### 메모리 부족 오류
```bash
# Swap 활성화 확인
sudo swapon --show

# Swap 생성 (512MB)
sudo fallocate -l 512M /var/swap
sudo chmod 600 /var/swap
sudo mkswap /var/swap
sudo swapon /var/swap
```

### PM2 서비스 재시작
```bash
pm2 restart asset-manager-backend
pm2 save
pm2 startup
```

### Nginx 설정 테스트
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 백업에서 복구
```bash
sudo cp -r /var/backups/asset-manager/backup_YYYYMMDD_HHMMSS/* /var/www/asset-manager/
sudo systemctl reload nginx
```

## 📁 디렉토리 구조

```
/home/pi/asset_manager/          # 소스 코드
├── deploy.sh                    # 배포 스크립트
├── apps/frontend/build/         # 빌드된 프론트엔드
└── apps/backend/               # 백엔드 소스

/var/www/asset-manager/         # Nginx 서비스 디렉토리
/var/backups/asset-manager/     # 백업 디렉토리
```

## ⚠️ 주의사항

- 라즈베리파이의 메모리 제한으로 인해 빌드 시 swap 사용이 필요할 수 있습니다
- 배포 전 항상 자동 백업이 생성됩니다
- PM2 프로세스명은 `asset-manager-backend`로 고정되어 있습니다
- Nginx 설정 파일은 `/etc/nginx/sites-available/asset-manager`에 있어야 합니다

## 📞 지원

배포 중 문제가 발생하면 다음을 확인하세요:
1. 로그 파일: `pm2 logs asset-manager-backend`
2. Nginx 로그: `sudo tail -f /var/log/nginx/error.log`
3. 시스템 로그: `sudo journalctl -u nginx -f`