<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {
    }

    public function index(): Response
    {
        $data = $this->dashboardService->getDashboardData(Auth::user());

        return Inertia::render('Dashboard', [
            'monthlyTotal' => $data['monthlyTotal'],
            'yearlyTotal' => $data['yearlyTotal'],
            'totalPaid' => $data['totalPaid'],
            'subscriptionsByCategory' => $data['subscriptionsByCategory'],
            'subscriptions' => $data['subscriptions'],
            'categories' => Subscription::CATEGORIES,
            'intervalMonths' => Subscription::INTERVAL_MONTHS,
        ]);
    }
}
