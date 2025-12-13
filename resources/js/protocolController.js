//protocolController.js

import model from './protocolModel.js';
import ProtocolView from './protocolView.js';



class ProtocolController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bindings
        this.view.bindAdd(this.handleAdd);
        this.view.bindToggle(this.handleToggle);
        this.view.bindDelete(this.handleDelete);
        this.view.bindSearch(this.handleSearch);
        this.view.bindFilter(this.handleFilter);
        this.view.bindOpenModal(this.handleOpenModal);
        this.view.bindEdit(this.handleEdit);

        // Carregar dados iniciais
        this.init();
    }

    async init() {
        const protocols = await this.model.getAll();
        this.view.render(protocols);
    }

    // Adicionar ocorrência
    handleAdd = async (vehicle, occDate, occTime, desc) => {
        const newProtocol = await this.model.add(vehicle, occDate, occTime, desc);
        this.view.render(await this.model.getAll());
    };

    // Alternar concluído
    handleToggle = async (id) => {
        await this.model.toggle(id);
        const protocols = await this.model.getAll();
        const role = (document.body.dataset.role || "").toLowerCase();

        if (role.includes("ti noite")) {
            const deliveredOnly = protocols.filter(p => p.delivered);
            this.view.render(deliveredOnly); // ✅ mostra entregues
        } else {
            this.view.render(protocols);
        }
    };

    // Excluir
    handleDelete = async (id) => {
        await this.model.remove(id);
        this.view.render(await this.model.getAll());
    };

    // Buscar
    handleSearch = async (query) => {
        const protocols = await this.model.getAll();
        const filtered = protocols.filter(p =>
            p.vehicle.toLowerCase().includes(query.toLowerCase())
        );
        this.view.render(filtered);
    };

    // Filtrar
    handleFilter = async (filter) => {
        const protocols = await this.model.getAll();
        let filtered = protocols;

        if (filter === "pending") filtered = protocols.filter(p => !p.done && !p.delivered); // ✅ exclui entregues
        else if (filter === "done") filtered = protocols.filter(p => p.done);
        else if (filter === "delivered") filtered = protocols.filter(p => p.delivered && !p.done);

        this.view.render(filtered);
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
            this.view.render(await this.model.getAll());
        });
    };
}

// Instanciar controller
document.addEventListener("DOMContentLoaded", () => {
    new ProtocolController(model, new ProtocolView());
});

