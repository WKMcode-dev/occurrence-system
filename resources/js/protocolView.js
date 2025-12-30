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

            if (e.target.classList.contains("doneBtn")) {
                this.confirmDone(id);
            }
            else if (e.target.classList.contains("viewBtn")) {
                this.openModalHandler(id);
            }
            else if (e.target.classList.contains("deliverBtn")) {
                this.toggleHandler(id);
            }
            else if (e.target.classList.contains("deleteBtn")) {
                this.confirmDelete(id);
            }
            else if (e.target.classList.contains("editBtn")) {
                this.editHandler(id);
            }
        }); // ← aqui está o fechamento correto do addEventListener

        // Fechar modal de visualização
        this.closeModalBtn.onclick = () => this.overlay.classList.add("hidden");
        this.overlay.onclick = (e) => { if (e.target === this.overlay) this.overlay.classList.add("hidden"); };
    }

    confirmDelete(id) {
        // Cria overlay de confirmação para exclusão
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
    confirmDone(id) {
        // Cria overlay de confirmação para concluir
        const overlay = document.createElement("div");
        overlay.className = "confirmOverlay";

        overlay.innerHTML = `
    <div class="confirmModal">
        <h2>Tem certeza que deseja concluir?</h2>
        <p>Depois de concluído, não será possível voltar para "Entregues".</p>
        <div class="confirmButtons">
            <button id="confirmDoneBtn" class="confirmBtn">Concluir</button>
            <button id="cancelDoneBtn" class="cancelBtn">Cancelar</button>
        </div>
    </div>
`;

        document.body.appendChild(overlay);

        const confirmBtn = overlay.querySelector("#confirmDoneBtn");
        const cancelBtn = overlay.querySelector("#cancelDoneBtn");

        confirmBtn.onclick = () => {
            this.toggleHandler(id); // chama o controller para concluir
            overlay.remove();
        };

        cancelBtn.onclick = () => overlay.remove();

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }

    confirmBulkDelete(ids) {
        const overlay = document.createElement("div");
        overlay.className = "confirmOverlay";

        overlay.innerHTML = `
        <div class="confirmModal">
            <h2>Tem certeza que deseja excluir ${ids.length} ocorrências?</h2>
            <p>Digite <strong>EXCLUIR</strong> no campo abaixo para confirmar:</p>
            <input id="confirmBulkInput" placeholder="Digite EXCLUIR">
            <div class="confirmButtons">
                <button id="confirmBulkDeleteBtn">Excluir</button>
                <button id="cancelBulkDeleteBtn">Cancelar</button>
            </div>
        </div>
    `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector("#confirmBulkInput");
        const confirmBtn = overlay.querySelector("#confirmBulkDeleteBtn");
        const cancelBtn = overlay.querySelector("#cancelBulkDeleteBtn");

        confirmBtn.onclick = () => {
            if (input.value.trim().toUpperCase() === "EXCLUIR") {
                this.bulkDeleteHandler(ids); // chama o controller
                overlay.remove();
            } else {
                alert("Você precisa digitar EXCLUIR para confirmar.");
            }
        };

        cancelBtn.onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
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
    bindBulkDelete(handler) {
        this.bulkDeleteHandler = handler;
    }

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
        if (userRole.includes("ti manhã") || userRole.includes("ti noite")) {
            if (this.addButton) {
                this.addButton.disabled = true;
                this.addButton.style.opacity = "0.5";
                this.addButton.style.cursor = "not-allowed";
            }
        }

        const userName = document.body.dataset.user;

        protocols.forEach(p => {
            const div = document.createElement("div");
            div.className = "protocol" + (p.done ? " done" : "") + (p.delivered ? " delivered" : "");
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
                buttonsHTML = `<button class="viewBtn" data-id="${p.id}">Visualizar</button>`;
            }

            // Monta o card com checkbox de seleção
            div.innerHTML = `
            <div class="protocol-info">
        <input type="checkbox" class="selectBox" data-id="${p.id}">
        <p><strong>Veículo:</strong> ${p.vehicle}</p>
        <p><strong>Data da ocorrência:</strong> ${this.formatPlainDate(p.occurrenceDate)}</p>
        <p><strong>Horário:</strong> ${p.occurrenceTime}</p>

        <p><strong>Descrição:</strong> ${p.desc}</p>
    </div>

            <div class="protocol-created">
                Criado em: ${this.formatDate(p.createdAt)}<br>
                Por: ${p.author ?? userName}
                <br>
                Expira em: ${p.expiresAt ? this.formatDate(p.expiresAt) : "—"}

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

        // ✅ Controle do botão global de exclusão (fora do forEach)
        const bulkBtn = document.getElementById("bulkDeleteBtn");
        const checkboxes = document.querySelectorAll(".selectBox");

        // força esconder se não houver nada marcado
        const selected = Array.from(checkboxes).filter(c => c.checked);
        bulkBtn.classList.toggle("hidden", selected.length === 0);

        checkboxes.forEach(cb => {
            cb.onchange = () => {
                const selected = Array.from(checkboxes).filter(c => c.checked);
                bulkBtn.classList.toggle("hidden", selected.length === 0);
            };
        });
        bulkBtn.onclick = () => {
            const selectedIds = Array.from(document.querySelectorAll(".selectBox:checked"))
                .map(cb => cb.dataset.id);

            if (selectedIds.length > 0) {
                this.confirmBulkDelete(selectedIds); // chama a modal de confirmação
            }
        };

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
    renderPagination(currentPage, lastPage, onPageChange) {
        const container = document.querySelector(".pagination");
        if (!container) return;

        container.innerHTML = "";

        // Botão anterior
        const prev = document.createElement("button");
        prev.textContent = "<";
        prev.disabled = currentPage === 1;
        prev.onclick = () => onPageChange(currentPage - 1);

        // Página atual
        const label = document.createElement("span");
        label.textContent = `Página ${currentPage} de ${lastPage}`;

        // Botão próximo
        const next = document.createElement("button");
        next.textContent = ">";
        next.disabled = currentPage === lastPage;
        next.onclick = () => onPageChange(currentPage + 1);

        container.appendChild(prev);
        container.appendChild(label);
        container.appendChild(next);
    }
}

// Instância global
export default ProtocolView;