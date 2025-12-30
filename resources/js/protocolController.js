//protocolController.js

import model from './protocolModel.js';
import ProtocolView from './protocolView.js';



class ProtocolController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentPage = 1;

        // Bindings
        this.view.bindAdd(this.handleAdd);
        this.view.bindToggle(this.handleToggle);
        this.view.bindDelete(this.handleDelete);
        this.view.bindBulkDelete(this.handleBulkDelete);
        this.view.bindSearch(this.handleSearch);
        this.view.bindFilter(this.handleFilter);
        this.view.bindOpenModal(this.handleOpenModal);
        this.view.bindEdit(this.handleEdit);

        // Carregar dados iniciais
        this.init();
    }

    async init() {
        const result = await this.model.getAll(this.currentPage);
        this.view.render(result.protocols);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    }

    handlePageChange = async (newPage) => {
        this.currentPage = newPage;
        const result = await this.model.getAll(newPage);
        this.view.render(result.protocols);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };

    // Adicionar ocorrência
    handleAdd = async (vehicle, occDate, occTime, desc) => {
        await this.model.add(vehicle, occDate, occTime, desc);
        const result = await this.model.getAll(this.currentPage);
        this.view.render(result.protocols);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };

    // Alternar concluído
    handleToggle = async (id) => {
        await this.model.toggle(id);
        const result = await this.model.getAll(this.currentPage);
        const role = (document.body.dataset.role || "").toLowerCase();

        if (role.includes("ti noite")) {
            const deliveredOnly = result.protocols.filter(p => p.delivered);
            this.view.render(deliveredOnly);
        } else {
            this.view.render(result.protocols);
        }
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };

    // Excluir
    handleDelete = async (id) => {
        await this.model.remove(id);
        const result = await this.model.getAll(this.currentPage);
        this.view.render(result.protocols);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };
    handleBulkDelete = async (ids) => {
    // chama o model para excluir em lote
    await this.model.bulkDelete(ids);
    // recarrega a lista atualizada
    const result = await this.model.getAll(this.currentPage);
    this.view.render(result.protocols);
    this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
};



    // Buscar
    handleSearch = async (query) => {
        const result = await this.model.getAll(this.currentPage);
        const filtered = result.protocols.filter(p =>
            p.vehicle.toLowerCase().includes(query.toLowerCase())
        );
        this.view.render(filtered);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };

    // Filtrar
    handleFilter = async (filter) => {
        const result = await this.model.getAll(this.currentPage);
        let filtered = result.protocols;

        if (filter === "pending") filtered = result.protocols.filter(p => !p.done && !p.delivered);
        else if (filter === "done") filtered = result.protocols.filter(p => p.done);
        else if (filter === "delivered") filtered = result.protocols.filter(p => p.delivered && !p.done);

        this.view.render(filtered);
        this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
    };

    // Abrir modal
    handleOpenModal = async (id) => {
        const protocol = await this.model.getById(id);
        this.view.showModal(protocol);
    };

    // Editar
    handleEdit = async (id) => {
        const protocol = await this.model.getById(id);
        this.view.showEditModal(protocol, async (vehicle, date, time, desc) => {
            await this.model.update(id, vehicle, date, time, desc);
            const result = await this.model.getAll(this.currentPage);
            this.view.render(result.protocols);
            this.view.renderPagination(result.currentPage, result.lastPage, this.handlePageChange);
        });
    };

}

// Instanciar controller
document.addEventListener("DOMContentLoaded", () => {
    new ProtocolController(model, new ProtocolView());
});