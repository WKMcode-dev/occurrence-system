<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Gerenciador de Ocorrência</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @vite('resources/css/style.css')

    @vite([
    'resources/css/base.css',
    'resources/css/topbar.css',
    'resources/css/form.css',
    'resources/css/tools.css',
    'resources/css/list.css',
    'resources/css/modal.css',
    'resources/css/editModal.css',
    'resources/css/pagination.css',
    'resources/css/sideMenu.css'
    ])

    @vite(['resources/js/protocolModel.js', 'resources/js/protocolView.js', 'resources/js/protocolController.js', 'resources/js/sideMenu.js'])

    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>

<body data-role="{{ strtolower(Auth::user()->role) }}" data-user="{{ Auth::user()->username }}">


    <button id="menuToggle">
        <img src="{{ asset('icons/Menu_Icon.png') }}" alt="Menu" class="menu-icon">
    </button>
    <div id="menuOverlay" class="hidden"></div>

    <!-- Barra lateral -->
    <div id="sideMenu">

        <div class="side-user">
            <button id="menuClose">
                <img src="{{ asset('icons/Close_Icon.png') }}" alt="Fechar" class="close-icon">
            </button>

            <div class="side-avatar">
                {{ strtoupper(substr(Auth::user()->username, 0, 1)) }}
            </div>
            <div class="side-name">
                {{ Auth::user()->username }}
            </div>
            <form class="Exit_Door" method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="side-logout">
                    <img src="{{ asset('icons/Exit_Door.png') }}" alt="Sair" class="logout-icon">
                </button>
            </form>
        </div>

        <ul class="List_Menu">
            @if(strtolower(Auth::user()->role) === 'gestor')
            <li class="menu-item">
                <a href="{{ route('register') }}" class="menu-link">
                    <span class="menu-label">Incluir Funcionário</span>
                    <span class="menu-divider"></span>
                    <span class="menu-icon">
                        <img src="{{ asset('icons/Add_Func.png') }}" alt="Adicionar Funcionário">
                    </span>
                </a>

            </li>
            @endif
        </ul>
    </div>


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
        <button class="filterBtn" data-filter="delivered">Entregues</button>
    </div>

    <!-- LISTA DE OCORRÊNCIAS -->
     <button id="bulkDeleteBtn" class="hidden">Excluir selecionados</button>
    <div id="list"></div>
    

    <!-- Paginação -->
    <div class="pagination">
        @if ($occurrences->onFirstPage())
        <span class="disabled">&lt;</span>
        @else
        <a href="{{ $occurrences->previousPageUrl() }}">&lt;</a>
        @endif

        <span>{{ $occurrences->currentPage() }}</span>

        @if ($occurrences->hasMorePages())
        <a href="{{ $occurrences->nextPageUrl() }}">&gt;</a>
        @else
        <span class="disabled">&gt;</span>
        @endif
    </div>

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