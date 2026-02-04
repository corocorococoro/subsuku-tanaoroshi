<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * ダッシュボード用の集計データを取得
     */
    public function getDashboardData(User $user): array
    {
        $allSubscriptions = $user->subscriptions()->orderBy('next_billing_on')->get();
        $activeSubscriptions = $allSubscriptions->where('status', 'active');

        return [
            'monthlyTotal' => $this->calculateMonthlyTotal($activeSubscriptions),
            'yearlyTotal' => $this->calculateYearlyTotal($activeSubscriptions),
            'totalPaid' => $this->calculateTotalPaid($allSubscriptions),
            'subscriptionsByCategory' => $this->getSubscriptionsByCategory($activeSubscriptions),
            'subscriptions' => $allSubscriptions,
        ];
    }

    /**
     * 月額合計を計算
     */
    private function calculateMonthlyTotal(Collection $subscriptions): int
    {
        return $subscriptions->sum(function ($subscription) {
            return $subscription->monthly_equiv_yen;
        });
    }

    /**
     * 年額合計を計算
     */
    private function calculateYearlyTotal(Collection $subscriptions): int
    {
        return $subscriptions->sum(function ($subscription) {
            return $subscription->yearly_equiv_yen;
        });
    }

    /**
     * これまでの累計支払額を計算（全サブスク対象）
     */
    private function calculateTotalPaid(Collection $subscriptions): int
    {
        return $subscriptions->sum(function ($subscription) {
            return $subscription->total_paid;
        });
    }

    /**
     * カテゴリ別の集計を取得（グラフ用）
     */
    private function getSubscriptionsByCategory(Collection $subscriptions): array
    {
        return $subscriptions
            ->groupBy('category')
            ->map(function ($items, $category) {
                return [
                    'category' => $category,
                    'monthlyTotal' => $items->sum(fn ($s) => $s->monthly_equiv_yen),
                    'yearlyTotal' => $items->sum(fn ($s) => $s->yearly_equiv_yen),
                    'count' => $items->count(),
                ];
            })
            ->sortByDesc('monthlyTotal')
            ->values()
            ->toArray();
    }
}
