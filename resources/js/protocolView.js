//view.js

class ProtocolView {
    constructor() {
        // Saudação logo ao iniciar
        const userName = document.body.dataset.user;
        const greeting = document.getElementById("greeting");
        if (greeting && userName) {
            greeting.textContent = `Olá, ${userName}`;
        }

        // Lista de protocolos
        this.list = document.getElementById("list");

        // Inputs do formulário
        this.inputVehicle = document.getElementById("inputVehicle");
        this.inputOccurrenceDate = document.getElementById("inputOccurrenceDate");
        this.inputOccurrenceTime = document.getElementById("inputOccurrenceTime");
        this.inputDesc = document.getElementById("inputDesc");

        // Botões e filtros
        this.addButton = document.getElementById("addButton");
        this.searchBox = document.getElementById("searchBox");
        this.filterButtons = document.querySelectorAll(".filterBtn");

        // Modal de visualização
        this.overlay = document.getElementById("overlay");
        this.closeModalBtn = document.getElementById("closeModal");
        this.modalVehicle = document.getElementById("modalVehicle");
        this.modalCreated = document.getElementById("modalCreated");
        this.modalOccurrenceDate = document.getElementById("modalOccurrenceDate");
        this.modalOccurrenceTime = document.getElementById("modalOccurrenceTime");
        this.modalDesc = document.getElementById("modalDesc");

        // Modal de edição será criado dinamicamente
        this.editOverlay = null;

        // Event delegation para lista de protocolos
        this.list.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains("doneBtn")) this.toggleHandler(id);
            else if (e.target.classList.contains("viewBtn")) this.openModalHandler(id);
            else if (e.target.classList.contains("deliverBtn")) this.toggleHandler(id);
            else if (e.target.classList.contains("deleteBtn")) {
                this.confirmDelete(id);
            }
            else if (e.target.classList.contains("editBtn")) this.editHandler(id);
            else if (e.target.closest(".protocol")) this.openModalHandler(id);
        });

        // Fechar modal de visualização
        this.closeModalBtn.onclick = () => this.overlay.classList.add("hidden");
        this.overlay.onclick = (e) => { if (e.target === this.overlay) this.overlay.classList.add("hidden"); };
    }

    confirmDelete(id) {
        // Cria overlay de confirmação
        const overlay = document.createElement("div");
        overlay.className = "confirmOverlay";

        overlay.innerHTML = `
        <div class="confirmModal">
            <h2>Tem certeza que deseja excluir?</h2>
            <p>Digite <strong>EXCLUIR</strong> no campo abaixo para confirmar:</p>
            <input id="confirmInput" placeholder="Digite EXCLUIR">
            <div class="confirmButtons">
                <button id="confirmDeleteBtn">Excluir</button>
                <button id="cancelDeleteBtn">Cancelar</button>
            </div>
        </div>
    `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector("#confirmInput");
        const confirmBtn = overlay.querySelector("#confirmDeleteBtn");
        const cancelBtn = overlay.querySelector("#cancelDeleteBtn");

        // Confirmar exclusão
        confirmBtn.onclick = () => {
            if (input.value.trim().toUpperCase() === "EXCLUIR") {
                this.deleteHandler(id);
                overlay.remove();
            } else {
                alert("Você precisa digitar EXCLUIR para confirmar.");
            }
        };

        // Cancelar exclusão
        cancelBtn.onclick = () => overlay.remove();

        // Fechar clicando fora
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }
    /* -------------------------------
        BINDINGS
    --------------------------------*/
    bindAdd(handler) {
        this.addButton.onclick = () => {
            const vehicle = this.inputVehicle.value.trim();
            const occDate = this.inputOccurrenceDate.value;
            const occTime = this.inputOccurrenceTime.value;
            const desc = this.inputDesc.value.trim();

            if (!vehicle || !occDate || !occTime || !desc) return;

            handler(vehicle, occDate, occTime, desc);

            // Limpa e foca no primeiro campo
            this.inputVehicle.value = "";
            this.inputOccurrenceDate.value = "";
            this.inputOccurrenceTime.value = "";
            this.inputDesc.value = "";
            this.inputVehicle.focus();
        };
    }

    bindToggle(handler) { this.toggleHandler = handler; }
    bindDelete(handler) { this.deleteHandler = handler; }
    bindSearch(handler) { this.searchBox.oninput = () => handler(this.searchBox.value); }
    bindFilter(handler) { this.filterButtons.forEach(btn => btn.onclick = () => handler(btn.dataset.filter)); }
    bindOpenModal(handler) { this.openModalHandler = handler; }
    bindEdit(handler) { this.editHandler = handler; }

    /* -------------------------------
        RENDER
    --------------------------------*/
    render(protocols) {
        this.list.innerHTML = "";

        if (protocols.length === 0) {
            this.list.innerHTML = `<p style="text-align:center; opacity:0.6;">Nenhum protocolo encontrado.</p>`;
            return;
        }

        const userRole = (document.body.dataset.role || "").toLowerCase();
        // Bloquear botão de adicionar para TI Manhã e TI Noite
        if (userRole.includes("ti manhã") || userRole.includes("ti noite")) {
            if (this.addButton) {
                this.addButton.disabled = true;
                this.addButton.style.opacity = "0.5";   // opcional, deixa visualmente desativado
                this.addButton.style.cursor = "not-allowed";
            }
        }

        const userName = document.body.dataset.user;


        protocols.forEach(p => {
            const div = document.createElement("div");
            div.className = "protocol" + (p.done ? " done" : "") + (p.delivered ? " delivered" : "");;
            div.dataset.id = p.id;

            // Decide quais botões mostrar
            let buttonsHTML = "";

            if (userRole.includes("ti noite")) {
                buttonsHTML = `
        <button class="viewBtn" data-id="${p.id}">Visualizar</button>
        <button class="deliverBtn" data-id="${p.id}">Entregar</button>
    `;
            } else if (userRole.includes("gestor")) {
                buttonsHTML = `<button class="viewBtn" data-id="${p.id}">Visualizar</button>`;
                if (p.delivered) {
                    buttonsHTML += `<button class="doneBtn" data-id="${p.id}">Concluir</button>`;
                }
                buttonsHTML += `
        <button class="editBtn" data-id="${p.id}">Editar</button>
        <button class="deleteBtn" data-id="${p.id}">Excluir</button>
    `;
            } else if (userRole.includes("aprendiz")) {
                buttonsHTML = `
        <button class="viewBtn" data-id="${p.id}">Visualizar</button>
        <button class="editBtn" data-id="${p.id}">Editar</button>
        <button class="deleteBtn" data-id="${p.id}">Excluir</button>
    `;

            } else if (userRole.includes("ti manhã")) {
                buttonsHTML = `
        <button class="viewBtn" data-id="${p.id}">Visualizar</button>
    `;
            }


            div.innerHTML = `
    <div class="protocol-info">
        <p><strong>Veículo:</strong> ${p.vehicle}</p>
        <p><strong>Data da ocorrência:</strong> ${this.formatPlainDate(p.occurrenceDate)}</p>
        <p><strong>Horário:</strong> ${p.occurrenceTime}</p>
        <p><strong>Descrição:</strong> ${p.desc}</p>
    </div>
    <div class="protocol-created">
        Criado em: ${this.formatDate(p.createdAt)}<br>
        Por: ${p.author ?? userName}
    </div>
    <div class="protocol-buttons">
    <div class="button-group">
        ${buttonsHTML}
    </div>
    <div class="status-group">
        <span class="statusTag ${p.done ? "done" : p.delivered ? "delivered" : "pending"}">
            ${p.done ? "Concluído" : p.delivered ? "Entregue" : "Pendente"}
        </span>
    </div>
</div>
`;

            this.list.appendChild(div);
        });
    }

    /* -------------------------------
    FORMATAR DATA (padrão brasileiro dd/mm/yyyy)
--------------------------------*/
    formatDate(dateStr) {
        // Para timestamps com hora (createdAt), pode continuar usando Date:
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }

    formatPlainDate(yyyyMmDd) {
        // Para campos do tipo DATE (occurrence_date), não use Date()
        const [year, month, day] = yyyyMmDd.split("-");
        return `${day}/${month}/${year}`;
    }


    /* -------------------------------
        MODAL DE VISUALIZAÇÃO
    --------------------------------*/
    showModal(protocol) {
        this.modalVehicle.textContent = protocol.vehicle;
        this.modalCreated.textContent = this.formatDate(protocol.createdAt);
        this.modalOccurrenceDate.textContent = this.formatPlainDate(protocol.occurrenceDate);
        this.modalOccurrenceTime.textContent = protocol.occurrenceTime;
        this.modalDesc.value = protocol.desc;

        this.overlay.classList.remove("hidden");
    }

    /* -------------------------------
        MODAL DE EDIÇÃO DINÂMICO
    --------------------------------*/
    showEditModal(protocol, saveCallback) {
        // Remove modal antigo se existir
        if (this.editOverlay) this.editOverlay.remove();

        this.editOverlay = document.createElement("div");
        this.editOverlay.id = "editOverlay";
        this.editOverlay.className = "editOverlay";

        this.editOverlay.innerHTML = `
            <div id="editModal">
                <h2>Editar Protocolo</h2>
                <input id="editVehicle" placeholder="Número do Veículo" value="${protocol.vehicle}">
                <input id="editOccurrenceDate" type="date" value="${protocol.occurrenceDate}">
                <input id="editOccurrenceTime" type="time" value="${protocol.occurrenceTime}">
                <textarea id="editDesc" placeholder="Descrição">${protocol.desc}</textarea>
                <div class="editButtons">
                    <button id="saveEdit">Salvar</button>
                    <button id="cancelEdit">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.editOverlay);

        const editVehicle = this.editOverlay.querySelector("#editVehicle");
        const editDate = this.editOverlay.querySelector("#editOccurrenceDate");
        const editTime = this.editOverlay.querySelector("#editOccurrenceTime");
        const editDesc = this.editOverlay.querySelector("#editDesc");
        const saveBtn = this.editOverlay.querySelector("#saveEdit");
        const cancelBtn = this.editOverlay.querySelector("#cancelEdit");

        // Salvar alterações
        const onSave = () => {
            const vehicle = editVehicle.value.trim();
            const date = editDate.value;
            const time = editTime.value;
            const desc = editDesc.value.trim();

            if (!vehicle || !date || !time || !desc) return;

            saveCallback(vehicle, date, time, desc);
            this.editOverlay.remove();

            saveBtn.removeEventListener("click", onSave);
            cancelBtn.removeEventListener("click", onCancel);
        };

        // Cancelar edição
        const onCancel = () => {
            this.editOverlay.remove();
            saveBtn.removeEventListener("click", onSave);
            cancelBtn.removeEventListener("click", onCancel);
        };

        saveBtn.addEventListener("click", onSave);
        cancelBtn.addEventListener("click", onCancel);

        // Fechar clicando fora do modal
        this.editOverlay.onclick = (e) => {
            if (e.target === this.editOverlay) onCancel();
        };
    }
}

// Instância global
export default ProtocolView;