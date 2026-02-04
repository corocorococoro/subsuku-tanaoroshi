<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Subscriptions/Create', [
            'categories' => Subscription::CATEGORIES,
            'intervalMonths' => Subscription::INTERVAL_MONTHS,
        ]);
    }

    public function store(StoreSubscriptionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        // next_billing_onが空なら自動計算
        if (empty($data['next_billing_on'])) {
            $data['next_billing_on'] = $this->calculateNextBillingDate(
                $data['started_on'],
                $data['interval_months']
            );
        }

        Subscription::create($data);

        return redirect()->route('dashboard')
            ->with('success', 'サブスクリプションを追加しました。');
    }

    public function edit(Subscription $subscription): Response
    {
        $this->authorize('update', $subscription);

        return Inertia::render('Subscriptions/Edit', [
            'subscription' => $subscription,
            'categories' => Subscription::CATEGORIES,
            'intervalMonths' => Subscription::INTERVAL_MONTHS,
        ]);
    }

    public function update(UpdateSubscriptionRequest $request, Subscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);

        $data = $request->validated();

        // next_billing_onが空なら自動計算
        if (empty($data['next_billing_on'])) {
            $data['next_billing_on'] = $this->calculateNextBillingDate(
                $data['started_on'],
                $data['interval_months']
            );
        }

        $subscription->update($data);

        return redirect()->route('dashboard')
            ->with('success', 'サブスクリプションを更新しました。');
    }

    public function destroy(Subscription $subscription): RedirectResponse
    {
        $this->authorize('delete', $subscription);

        $subscription->delete();

        return redirect()->route('dashboard')
            ->with('success', 'サブスクリプションを削除しました。');
    }

    /**
     * 次回請求日を計算
     * started_on から interval_months を加算して、現在日以降になるまで繰り返す
     */
    private function calculateNextBillingDate(string $startedOn, int $intervalMonths): string
    {
        $startDate = Carbon::parse($startedOn);
        $nextBilling = $startDate->copy();
        $today = Carbon::today();

        while ($nextBilling->lt($today)) {
            $nextBilling->addMonthsNoOverflow($intervalMonths);
        }

        return $nextBilling->format('Y-m-d');
    }
}
