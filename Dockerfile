# ---------- Frontend (Vite) ----------
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
# output: /app/frontend/dist

# ---------- Backend (Go) ----------
FROM golang:1.24-alpine AS go
WORKDIR /app
# copy go deps first for better caching
COPY go.mod go.sum ./
RUN go mod download

# bring whole repo so embed picks up frontend/dist
COPY . .
# ensure embedded files exist in build context
# (web stage already created /app/frontend/dist; copy it here)
COPY --from=web /app/frontend/dist ./frontend/dist

ENV CGO_ENABLED=0 GOOS=linux
RUN go build -o /app/server .

# ---------- Final minimal image ----------
FROM alpine:3.20
WORKDIR /app
COPY --from=go /app/server /app/server
EXPOSE 8080
USER nobody
CMD ["/app/server"]
