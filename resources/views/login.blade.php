<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Login - Occurrence System</title>

    @vite('resources/css/login.css')
</head>

<body>
    <div class="login-box">
        <h2>Login</h2>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <input type="text" name="username" placeholder="Usuário" required>
            <input type="password" name="password" placeholder="Senha" required>
            <button type="submit">Entrar</button>
        </form>
        <p><a href="{{ route('register') }}">Criar conta</a></p>
    </div>
</body>

</html>