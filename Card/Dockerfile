FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 프로젝트 파일 전체 복사
COPY . .

# 1. 윈도우 줄바꿈(\r) 제거 및 실행 권한 부여 (CRLF -> LF 자동 변환)
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

# 2. 빌드 실행 (Render 무료 서버 메모리 초과 튕김 방지 옵션 추가)
RUN ./gradlew clean build -x test --no-daemon -Dorg.gradle.jvmargs="-Xmx256m"

# 실행 포트 지정
EXPOSE 8089

# 애플리케이션 실행
CMD ["java", "-jar", "build/libs/demo-0.0.1-SNAPSHOT.jar"]