<?php

namespace App\Http\Controllers;

use App\Models\PythonSchedule;
use Illuminate\Http\Request;

class PythonScheduleController extends Controller
{
    public function index()
    {
        return PythonSchedule::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'parameters' => 'nullable|array',
            'cron_expression' => 'required|string', // Cron形式のバリデーション
        ]);

        $schedule = PythonSchedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function update(Request $request, PythonSchedule $pythonSchedule)
    {
        $request->validate([
            'filename' => 'required|string',
            'parameters' => 'nullable|array',
            'cron_expression' => 'required|string',
        ]);

        $pythonSchedule->update($request->all());
        return response()->json($pythonSchedule);
    }

    public function destroy(PythonSchedule $pythonSchedule)
    {
        $pythonSchedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
}
