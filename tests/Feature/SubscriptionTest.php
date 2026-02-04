<?php

namespace Tests\Feature;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscriptions_index_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/subscriptions');

        $response->assertOk();
    }

    public function test_subscriptions_create_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/subscriptions/create');

        $response->assertOk();
    }

    public function test_user_can_create_subscription(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/subscriptions', [
                'name' => 'Netflix',
                'amount_yen' => 1490,
                'interval_months' => 1,
                'started_on' => '2024-01-01',
                'category' => '動画',
            ]);

        $response->assertRedirect('/subscriptions');

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'category' => '動画',
            'status' => 'active',
        ]);
    }

    public function test_user_can_update_subscription(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/subscriptions/{$subscription->id}", [
                'name' => 'Netflix Premium',
                'amount_yen' => 1980,
                'interval_months' => 1,
                'started_on' => '2024-01-01',
                'next_billing_on' => '2024-02-01',
                'category' => '動画',
                'status' => 'active',
            ]);

        $response->assertRedirect('/subscriptions');

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'name' => 'Netflix Premium',
            'amount_yen' => 1980,
        ]);
    }

    public function test_user_can_cancel_subscription(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/subscriptions/{$subscription->id}", [
                'name' => 'Netflix',
                'amount_yen' => 1490,
                'interval_months' => 1,
                'started_on' => '2024-01-01',
                'next_billing_on' => '2024-02-01',
                'category' => '動画',
                'status' => 'canceled',
            ]);

        $response->assertRedirect('/subscriptions');

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'canceled',
        ]);
    }

    public function test_user_can_delete_subscription(): void
    {
        $user = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete("/subscriptions/{$subscription->id}");

        $response->assertRedirect('/subscriptions');

        $this->assertDatabaseMissing('subscriptions', [
            'id' => $subscription->id,
        ]);
    }

    public function test_user_cannot_update_other_users_subscription(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user1->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($user2)
            ->put("/subscriptions/{$subscription->id}", [
                'name' => 'Hacked',
                'amount_yen' => 0,
                'interval_months' => 1,
                'started_on' => '2024-01-01',
                'next_billing_on' => '2024-02-01',
                'category' => '動画',
                'status' => 'active',
            ]);

        $response->assertForbidden();
    }

    public function test_user_cannot_delete_other_users_subscription(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $subscription = Subscription::create([
            'user_id' => $user1->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($user2)
            ->delete("/subscriptions/{$subscription->id}");

        $response->assertForbidden();
    }

    public function test_interval_months_must_be_valid(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/subscriptions', [
                'name' => 'Netflix',
                'amount_yen' => 1490,
                'interval_months' => 5, // Invalid: not in [1,2,3,4,6,12]
                'started_on' => '2024-01-01',
                'category' => '動画',
            ]);

        $response->assertSessionHasErrors('interval_months');
    }

    public function test_category_must_be_valid(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/subscriptions', [
                'name' => 'Netflix',
                'amount_yen' => 1490,
                'interval_months' => 1,
                'started_on' => '2024-01-01',
                'category' => 'Invalid Category',
            ]);

        $response->assertSessionHasErrors('category');
    }
}
