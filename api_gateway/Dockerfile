# Stage 1: Build
FROM maven:3.9.9-amazoncorretto-21-alpine AS build
WORKDIR /app

# Copy Maven config và source code
COPY pom.xml .
COPY src ./src

# Build và đóng gói
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar từ stage build
COPY --from=build /app/target/*.jar ./app.jar

# Expose port ứng dụng
EXPOSE 8080

# Entry point
ENTRYPOINT ["java","-jar","app.jar"]
