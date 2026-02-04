<?php

namespace Tests\Feature;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/dashboard');

        $response->assertOk();
    }

    public function test_dashboard_shows_correct_totals(): void
    {
        $user = User::factory()->create();

        // Create active subscriptions
        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490, // monthly
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Adobe',
            'amount_yen' => 6480, // yearly
            'interval_months' => 12,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2025-01-01',
            'category' => '仕事',
            'status' => 'active',
        ]);

        // Create canceled subscription (should not be counted)
        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Canceled Service',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => 'その他',
            'status' => 'canceled',
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/dashboard');

        $response->assertOk();

        // Netflix: 1490/month = 1490 monthly, 17880 yearly
        // Adobe: 6480/year = 540 monthly, 6480 yearly
        // Total: 2030 monthly, 24360 yearly
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('monthlyTotal')
            ->has('yearlyTotal')
            ->where('monthlyTotal', 2030) // 1490 + 540
            ->where('yearlyTotal', 24360) // 17880 + 6480
        );
    }

    public function test_dashboard_excludes_canceled_subscriptions(): void
    {
        $user = User::factory()->create();

        // Create only canceled subscription
        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Canceled Service',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => 'その他',
            'status' => 'canceled',
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('monthlyTotal', 0)
            ->where('yearlyTotal', 0)
        );
    }
}
