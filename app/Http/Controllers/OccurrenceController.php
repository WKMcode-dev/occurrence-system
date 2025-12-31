<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Occurrence;
use App\Models\User;
use App\Models\TaguatingaVehicle;
use App\Models\PsulVehicle;




class OccurrenceController extends Controller
{
    /**
     * Página principal (Blade) - renderiza a view com os dados
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'Aprendiz') {
            $occurrences = Occurrence::with('taguatingaVehicle', 'psulVehicle', 'user')
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(6);
        } else {
            $occurrences = Occurrence::with('taguatingaVehicle', 'psulVehicle', 'user')
                ->orderBy('created_at', 'desc')
                ->paginate(6);
        }

        return view('occurrence', compact('occurrences'));
    }

    /**
     * API JSON - lista ocorrências (para o JS consumir)
     */
    public function listJson(Request $request)
    {
        $user = Auth::user();
        $perPage = 6;
        $page = $request->input('page', 1);

        if ($user->role === 'Aprendiz') {
            return Occurrence::with('taguatingaVehicle', 'psulVehicle', 'user')
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);
        }

        return Occurrence::with('taguatingaVehicle', 'psulVehicle', 'user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }




    /**
     * Criar nova ocorrência
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'TI Noite') {
            abort(403, 'TI da Noite não pode criar ocorrências.');
        }

        $data = $request->validate([
            'vehicle'          => 'required|string',
            'occurrence_date'  => 'required|date',
            'occurrence_time'  => 'required',
            'description'      => 'required|string',
        ]);

        $taguatinga = TaguatingaVehicle::where('number', $data['vehicle'])->first();
        $psul = PsulVehicle::where('number', $data['vehicle'])->first();

        if (!$taguatinga && !$psul) {
            abort(404, 'Veículo não encontrado em nenhuma frota.');
        }

        $occurrenceData = [
            'created_by'      => $user->id,
            'occurrence_date' => $data['occurrence_date'],
            'occurrence_time' => $data['occurrence_time'],
            'description'     => $data['description'],
        ];

        if ($taguatinga) {
            $occurrenceData['taguatinga_vehicle_id'] = $taguatinga->id;
        } else {
            $occurrenceData['psul_vehicle_id'] = $psul->id;
        }

        $occurrence = Occurrence::create($occurrenceData);

        // Carrega os relacionamentos no objeto já criado
        $occurrence->load('taguatingaVehicle', 'psulVehicle', 'user');

        return response()->json($occurrence, 201);
    }


    /**
     * Mostrar uma ocorrência
     */
    public function show($id)
    {
        return Occurrence::with('taguatingaVehicle', 'psulVehicle', 'user')->findOrFail($id);
    }


    /**
     * Atualizar ocorrência
     */
    public function update(Request $request, $id)
    {
        $occurrence = Occurrence::findOrFail($id);
        $user = Auth::user();

        if ($user->role === 'TI Noite') {
            abort(403, 'TI da Noite não pode editar ocorrências.');
        }

        if ($user->role === 'Aprendiz' && $occurrence->created_by !== $user->id) {
            abort(403, 'Você não pode editar ocorrências de outros usuários.');
        }

        $occurrence->update($request->only([
            'occurrence_date',
            'occurrence_time',
            'description'
        ]));

        $occurrence->load('taguatingaVehicle', 'psulVehicle', 'user');

        return response()->json($occurrence);
    }


    /**
     * Remover ocorrência
     */
    public function destroy($id)
    {
        $occurrence = Occurrence::findOrFail($id);
        $user = Auth::user();

        if ($user->role === 'TI Noite') {
            abort(403, 'TI da Noite não pode excluir ocorrências.');
        }

        if ($user->role === 'Aprendiz' && $occurrence->created_by !== $user->id) {
            abort(403, 'Você não pode excluir ocorrências de outros usuários.');
        }

        $occurrence->delete();
        return response()->json(['message' => 'Deleted']);
    }


    /**
     * Alternar status (done/delivered)
     */
    public function toggle($id)
    {
        $occurrence = Occurrence::findOrFail($id);
        $user = Auth::user();

        if ($user->role === 'TI Noite') {
            // Alterna status de entrega
            $occurrence->delivered = !$occurrence->delivered;
            $occurrence->save();

            $occurrence->load('taguatingaVehicle', 'psulVehicle', 'user');
            return response()->json($occurrence);
        }

        if (in_array($user->role, ['Gestor', 'TI Manhã'])) {
            if (!$occurrence->delivered) {
                abort(403, 'A ocorrência precisa ser entregue pela TI da Noite antes de ser concluída.');
            }

            // Alterna status de conclusão
            $occurrence->done = !$occurrence->done;

            if ($occurrence->done) {
                // Se acabou de ser concluída, define expiração para 15 dias
                $occurrence->expires_at = now()->addDays(15);
            } else {
                // Se desmarcar como concluída, remove expiração
                $occurrence->expires_at = null;
            }

            $occurrence->save();

            $occurrence->load('taguatingaVehicle', 'psulVehicle', 'user');
            return response()->json($occurrence);
        }

        abort(403, 'Você não tem permissão para alterar esta ocorrência.');
    }
}
