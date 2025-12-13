<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro - Occurrence System</title>
    @vite('resources/css/cadastro.css')
</head>
<body>
    <div class="register-box">
        <h2>Cadastro</h2>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <input type="text" name="username" placeholder="Usuário" required>
            <input type="password" name="password" placeholder="Senha" required>
            <input type="password" name="password_confirmation" placeholder="Confirmar senha" required>

            <select name="role" required>
                <option value="">Selecione o cargo</option>
                <option value="TI Manhã">TI Manhã</option>
                <option value="TI Noite">TI Noite</option>
                <option value="Gestor">Gestor</option>
                <option value="Aprendiz">Aprendiz</option>
            </select>

            <button type="submit">Registrar</button>
        </form>
    </div>
</body>
</html>