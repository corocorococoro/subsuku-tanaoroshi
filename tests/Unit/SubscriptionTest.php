<?php

namespace Tests\Unit;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_equiv_yen_calculation_for_monthly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $this->assertEquals(1490, $subscription->monthly_equiv_yen);
    }

    public function test_monthly_equiv_yen_calculation_for_yearly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 12000,
            'interval_months' => 12,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2025-01-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $this->assertEquals(1000, $subscription->monthly_equiv_yen);
    }

    public function test_monthly_equiv_yen_calculation_for_quarterly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 3000,
            'interval_months' => 3,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-04-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $this->assertEquals(1000, $subscription->monthly_equiv_yen);
    }

    public function test_yearly_equiv_yen_calculation_for_monthly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $this->assertEquals(12000, $subscription->yearly_equiv_yen);
    }

    public function test_yearly_equiv_yen_calculation_for_yearly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 12000,
            'interval_months' => 12,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2025-01-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $this->assertEquals(12000, $subscription->yearly_equiv_yen);
    }

    public function test_yearly_equiv_yen_calculation_for_bimonthly(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Test',
            'amount_yen' => 2000,
            'interval_months' => 2,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-03-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        // 2000 * (12 / 2) = 2000 * 6 = 12000
        $this->assertEquals(12000, $subscription->yearly_equiv_yen);
    }

    public function test_active_scope(): void
    {
        $user = User::factory()->create();

        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Active',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Canceled',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'canceled',
        ]);

        $activeCount = Subscription::active()->count();
        $this->assertEquals(1, $activeCount);
    }

    public function test_canceled_scope(): void
    {
        $user = User::factory()->create();

        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Active',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Canceled',
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'canceled',
        ]);

        $canceledCount = Subscription::canceled()->count();
        $this->assertEquals(1, $canceledCount);
    }
}
