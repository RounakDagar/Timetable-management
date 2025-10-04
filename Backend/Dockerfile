# 1. Start with a base that has Java 21
FROM openjdk:21-jdk-slim

# 2. Set up a workspace inside the container
WORKDIR /app

# 3. Copy your application's JAR file into the workspace
COPY target/Time-Table-Management-0.0.1-SNAPSHOT.jar app.jar

# 4. Tell Docker that the application uses port 8080
EXPOSE 8080

# 5. The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
