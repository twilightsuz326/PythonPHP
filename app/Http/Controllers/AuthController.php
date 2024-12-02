<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // バリデーション
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 認証試行
        if (!Auth::attempt($credentials)) {
            // ログイン失敗のログ
            Log::warning('Login failed', [
                'email' => $credentials['email'],
                'ip' => $request->ip(),
            ]);

            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // セッション再生成
        $request->session()->regenerate();
        $user = Auth::user();

        // ログイン成功のログ
        Log::info('Login successful', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
        ]);

        return response()->json(['user' => $user], 200);
    }
}
