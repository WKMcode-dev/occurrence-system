<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Occurrence;
use App\Models\Vehicle;

class OccurrenceController extends Controller
{
    /**
     * Página principal (Blade) - renderiza a view com os dados
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'Aprendiz') {
            $occurrences = Occurrence::with('vehicle', 'user')
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $occurrences = Occurrence::with('vehicle', 'user')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return view('occurrence', compact('occurrences'));
    }

    /**
     * API JSON - lista ocorrências (para o JS consumir)
     */
    public function listJson()
    {
        $user = Auth::user();

        if ($user->role === 'Aprendiz') {
            return Occurrence::with('vehicle', 'user')
                ->where('created_by', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Occurrence::with('vehicle', 'user')
            ->orderBy('created_at', 'desc')
            ->get();
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

        $vehicle = Vehicle::where('number', $data['vehicle'])->firstOrFail();

        $occurrence = Occurrence::create([
            'vehicle_id'       => $vehicle->id,
            'created_by'       => $user->id,
            'occurrence_date'  => $data['occurrence_date'],
            'occurrence_time'  => $data['occurrence_time'],
            'description'      => $data['description'],
        ]);

        return response()->json($occurrence->load('vehicle', 'user'), 201);
    }


    /**
     * Mostrar uma ocorrência
     */
    public function show($id)
    {
        return Occurrence::with('vehicle', 'user')->findOrFail($id);
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
            'vehicle_id',
            'occurrence_date',
            'occurrence_time',
            'description'
        ]));

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
            $occurrence->delivered = $occurrence->delivered ? false : true;
            $occurrence->save();
            return response()->json($occurrence);
        }

        if (in_array($user->role, ['Gestor', 'TI Manhã'])) {
            
            if (!$occurrence->delivered) {
                abort(403, 'A ocorrência precisa ser entregue pela TI da Noite antes de ser concluída.');
            }

            $occurrence->done = $occurrence->done ? false : true;
            $occurrence->save();
            return response()->json($occurrence);
        }

        abort(403, 'Você não tem permissão para alterar esta ocorrência.');
    }
}
