include .env

PORT ?= ${PORT}

.PHONY: build frontend_build build_mac build_win build_linux

current_dir := $(shell pwd)

build: frontend_build build_own_env build_mac build_win build_linux

bun:
	cd frontend && bun install

frontend_build: bun oas_graph
	cd frontend && bun run build

build_mac: frontend_build
	GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w -X main.AppMode=prod" -trimpath -o $(current_dir)/bin/mac/surume-local $(current_dir)/main.go

build_own_env: frontend_build
	go build -ldflags="-s -w -X main.AppMode=prod" -trimpath -o $(current_dir)/bin/your_pc/surume-local $(current_dir)/main.go


# use mingw-w64
build_win: frontend_build
	GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CXX=x86_64-w64-mingw32-g++ CC=x86_64-w64-mingw32-gcc go build -ldflags="-s -w -X main.AppMode=prod" -trimpath -o $(current_dir)/bin/win/surume-local.exe $(current_dir)/main.go

build_linux: frontend_build
	GOOS=linux GOARCH=amd64 go build -ldflags="-s -w -X main.AppMode=prod" -trimpath -o $(current_dir)/bin/linux/surume-local $(current_dir)/main.go

# bun, oas_graphは自前でやりなさい
dev: port_check
	cd frontend && bun run dev & ENV=dev air && fg

copy_data:
	cp -r ./data ./bin/$(PLATFORM)/

oas_graph:
	cd frontend && npx openapi-typescript https://github.com/microsoftgraph/msgraph-metadata/raw/master/openapi/v1.0/openapi.yaml -o src/types/oas.d.ts

oas_graph_beta:
	cd frontend && npx openapi-typescript https://github.com/microsoftgraph/msgraph-metadata/raw/master/openapi/beta/openapi.yaml -o src/types/oas.d.ts


port_check:
	@echo "Checking the availability of port $(PORT)..."
	@lsof -i :$(PORT) > /dev/null 2>&1; if [ $$? -eq 0 ]; then \
		echo "👺 Error: Port $(PORT) is already in use."; \
		echo "Details of the process occupying the port:"; \
		lsof -i :$(PORT) | awk 'NR>1 {print "PID: "$$2", User: "$$3", Command: "$$1}'; \
		exit 1; \
	else \
		echo "🎉 Port $(PORT) is not in use. let's go!"; \
	fi