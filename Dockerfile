FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM golang:1.24-alpine AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=frontend /app/frontend/dist ./frontend/dist

ENV CGO_ENABLED=0 GOOS=linux
RUN go build -o /app/server .

FROM alpine:3.20
WORKDIR /app
COPY --from=backend /app/server /app/server
EXPOSE 8080
USER nobody
CMD ["/app/server"]
