<?php

namespace Tests\Feature\Auth;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscriptions_are_deleted_when_account_is_deleted(): void
    {
        $user = User::factory()->create();

        // Create subscriptions for the user
        $sub1 = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Netflix',
            'amount_yen' => 1490,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '動画',
            'status' => 'active',
        ]);

        $sub2 = Subscription::create([
            'user_id' => $user->id,
            'name' => 'Spotify',
            'amount_yen' => 980,
            'interval_months' => 1,
            'started_on' => '2024-01-01',
            'next_billing_on' => '2024-02-01',
            'category' => '音楽',
            'status' => 'canceled',
        ]);

        // Assert subscriptions exist
        $this->assertDatabaseHas('subscriptions', ['id' => $sub1->id]);
        $this->assertDatabaseHas('subscriptions', ['id' => $sub2->id]);

        // Delete user account
        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/');

        // Verify user is deleted
        $this->assertNull(User::find($user->id));

        // Verify subscriptions are deleted (cascade)
        $this->assertDatabaseMissing('subscriptions', ['id' => $sub1->id]);
        $this->assertDatabaseMissing('subscriptions', ['id' => $sub2->id]);
    }
}
