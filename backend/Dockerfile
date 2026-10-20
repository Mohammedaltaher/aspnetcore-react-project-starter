FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Starter.slnx ./
COPY backend/src/Starter.Api/Starter.Api.csproj backend/src/Starter.Api/
COPY backend/src/Starter.Application/Starter.Application.csproj backend/src/Starter.Application/
COPY backend/src/Starter.Domain/Starter.Domain.csproj backend/src/Starter.Domain/
COPY backend/src/Starter.Infrastructure/Starter.Infrastructure.csproj backend/src/Starter.Infrastructure/
RUN dotnet restore backend/src/Starter.Api/Starter.Api.csproj
COPY backend/src/ backend/src/
RUN dotnet publish backend/src/Starter.Api/Starter.Api.csproj -c Release --no-restore -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/keys && chown $APP_UID:$APP_UID /app/keys
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "Starter.Api.dll"]
