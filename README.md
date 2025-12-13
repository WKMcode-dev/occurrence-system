<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# 🚗 Occurrence System

> **Sistema de gerenciamento de ocorrências de veículos**  
> Projeto desenvolvido em **Laravel + PostgreSQL + Vite.js**, com interface moderna e integração via PgAdmin.

---

## 📖 Sobre o projeto

O **Occurrence System** é uma aplicação web para registrar, acompanhar e gerenciar ocorrências relacionadas a veículos.  
Ele permite:
- Criar novas ocorrências com data, hora, veículo e descrição.
- Filtrar por status: **Pendentes**, **Entregues** e **Concluídos**.
- Editar e excluir registros.
- Visualizar detalhes em modais.
- Diferenciar permissões por **papel de usuário** (Gestor, TI Manhã, TI Noite, Aprendiz).

---

## ⚙️ Tecnologias utilizadas

- ⚡ **Laravel** — Framework PHP moderno
- 🐘 **PostgreSQL** — Banco de dados relacional
- 📊 **PgAdmin** — Gerenciador de banco
- 🎨 **Vite.js** — Bundler rápido para front-end
- 💻 **JavaScript (ES6+)** — Lógica de interação
- 🎨 **CSS3** — Estilização da interface

---

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/WKMcode-dev/occurrence-system.git
cd occurrence-system
```
### 2. Instale as dependências
```bash
composer install
npm install
```
### 3. Configure o .env
```SQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=occurrence_system
DB_USERNAME=postgres
DB_PASSWORD=SenhaDoBancoDeDados
```
### 4. Rode migrations e seeds
```bash
php artisan migrate --seed
```
### 5. Inicie os Servidores
Frontend (Vite.js)
```bash
npm run dev
```
Backend (Laravel)
```bash
php artisan serve
```
🛠️ Comandos úteis
- Rodar apenas a seed dos veículos:
```bash
php artisan db:seed --class=VehicleSeeder
```
- Resetar o banco e popular novamente:
```bash
php artisan migrate:fresh --seed
```
