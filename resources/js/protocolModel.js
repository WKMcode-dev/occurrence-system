// protocolModel.js

class ProtocolModel {
    constructor() {
        this.protocols = [];
        // Lê o token CSRF do meta no Blade
        this.token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    /**
     * Normaliza os dados vindos do backend para o formato esperado pela view
     */
    normalize(data) {
        return {
            id: data.id,
            vehicle: data.vehicle?.number ?? data.vehicle_id,
            occurrenceDate: data.occurrence_date,
            occurrenceTime: data.occurrence_time,
            desc: data.description,
            done: data.done,
            delivered: data.delivered,
            createdAt: data.created_at,
            author: data.user?.username
        };
    }

    /**
     * Carrega todos os protocolos do backend
     */
    async getAll() {
        const res = await fetch('/api/occurrences', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Erro ao listar: ${res.status}`);
        const raw = await res.json();
        this.protocols = raw.map(p => this.normalize(p));
        return this.protocols;
    }


    /**
     * Adiciona um novo protocolo
     */
    async add(vehicle, occurrenceDate, occurrenceTime, desc) {
        const res = await fetch('/api/occurrences', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRF-TOKEN': this.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                vehicle: vehicle,
                occurrence_date: occurrenceDate,
                occurrence_time: occurrenceTime,
                description: desc
            })
        });
        if (!res.ok) {
            throw new Error(`Erro ao criar ocorrência: ${res.status}`);
        }
        const raw = await res.json();
        const newProtocol = this.normalize(raw);
        this.protocols.push(newProtocol);
        return newProtocol;
    }

    /**
     * Marca ou desmarca protocolo como concluído/entregue
     */
    async toggle(id) {
        const res = await fetch(`/api/occurrences/${id}/toggle`, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: {
                'X-CSRF-TOKEN': this.token,
                'Accept': 'application/json'
            }
        });
        if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Erro ao alternar (${res.status}): ${msg}`);
        }
        const raw = await res.json();
        const updated = this.normalize(raw);
        this.protocols = this.protocols.map(p => p.id === id ? updated : p);
        return updated;
    }


    /**
     * Remove protocolo
     */
    async remove(id) {
        const res = await fetch(`/api/occurrences/${id}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-CSRF-TOKEN': this.token,
                'Accept': 'application/json'
            }
        });
        if (!res.ok) throw new Error(`Erro ao excluir: ${res.status}`);
        this.protocols = this.protocols.filter(p => p.id !== id);
    }


    /**
     * Atualiza protocolo existente
     */
    async update(id, vehicle, occurrenceDate, occurrenceTime, desc) {
        const res = await fetch(`/api/occurrences/${id}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-CSRF-TOKEN': this.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                vehicle,
                occurrence_date: occurrenceDate,
                occurrence_time: occurrenceTime,
                description: desc
            })
        });
        if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Erro ao atualizar (${res.status}): ${msg}`);
        }
        const raw = await res.json();
        const updated = this.normalize(raw);
        this.protocols = this.protocols.map(p => p.id === id ? updated : p);
        return updated;
    }



    /**
     * Busca protocolo pelo ID
     */
    async getById(id) {
        const res = await fetch(`/api/occurrences/${id}`, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Erro ao buscar: ${res.status}`);
        const raw = await res.json();
        return this.normalize(raw);
    }

}

// Exporta instância global
const model = new ProtocolModel();
export default model;