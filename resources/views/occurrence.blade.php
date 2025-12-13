<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Gerenciador de Ocorrência</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @vite('resources/css/style.css')

    @vite(['resources/js/protocolModel.js', 'resources/js/protocolView.js', 'resources/js/protocolController.js'])

    <style>

    </style>
</head>

<body data-role="{{ strtolower(Auth::user()->role) }}" data-user="{{ Auth::user()->username }}">

    <!-- Barra superior -->
    <div class="topbar">
        <h1>Gerenciador de Ocorrência</h1>
        <div class="user-info">
    <!-- Avatar com inicial do usuário -->
    <div class="avatar">
        {{ strtoupper(substr(Auth::user()->username, 0, 1)) }}
    </div>

    <!-- Saudação com nome -->
    <p id="greeting" class="greeting"></p>

    <!-- Botão de logout -->
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit" class="logout-btn">Sair</button>
    </form>
</div>
    </div>

    <!-- FORMULÁRIO DE CRIAÇÃO -->
    <div id="form">
        <input id="inputOccurrenceDate" type="date" placeholder="Data da Ocorrência">
        <input id="inputOccurrenceTime" type="time" placeholder="Horário da Ocorrência">
        <input id="inputVehicle" placeholder="Número do Veículo">
        <input id="inputDesc" placeholder="Descrição da ocorrência...">
        <button id="addButton">Adicionar</button>
    </div>

    <!-- TOOLS -->
    <div id="tools">
        <input id="searchBox" placeholder="Buscar veículo...">
        <button class="filterBtn" data-filter="all">Todos</button>
        <button class="filterBtn" data-filter="pending">Pendentes</button>
        <button class="filterBtn" data-filter="done">Concluídos</button>
        <button class="filterBtn" data-filter="delivered">Entregues</button> <!-- ✅ novo -->
    </div>

    <!-- LISTA DE OCORRÊNCIAS -->
    <div id="list"></div>

    <!-- MODAL DE DETALHES -->
    <div id="overlay" class="hidden">
        <div id="modal">
            <h2 id="modalVehicle"></h2>
            <p><strong>Criado em:</strong> <span id="modalCreated"></span></p>
            <p><strong>Data da ocorrência:</strong> <span id="modalOccurrenceDate"></span></p>
            <p><strong>Horário da ocorrência:</strong> <span id="modalOccurrenceTime"></span></p>
            <p><strong>Descrição:</strong></p>
            <textarea id="modalDesc" readonly></textarea>
            <button id="closeModal">Fechar</button>
        </div>
    </div>

    @vite('resources/js/app.js')
</body>

</html>