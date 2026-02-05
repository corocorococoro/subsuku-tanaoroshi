<?php

namespace Tests\Unit\Services;

use App\Models\Subscription;
use App\Services\DashboardService;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class DashboardServiceTest extends TestCase
{
    /**
     * 集計ロジックの検証
     * プライベートメソッドをテストするため、Reflectionを使用するか、
     * あるいは public メソッド経由で結果を検証する。
     * ここでは Collection の操作ロジックがメインなので、
     * Reflectionを使って private method 単体のロジックを保証するアプローチをとる。
     * (または、Serviceの一部メソッドをpublicにするか、Mockを使ってpublicメソッドから呼ぶか)
     *
     * DashboardServiceは現状 getDashboardData (public) が main entry point なので、
     * それをテストするのが最も統合的で良い。
     */
    public function test_calculate_methods_via_reflection()
    {
        $service = new DashboardService();

        // テスト用データ作成 (DB保存しないオンメモリモデル)
        $sub1 = new Subscription(['amount_yen' => 1000, 'interval_months' => 1]); // monthly: 1000, yearly: 12000
        $sub2 = new Subscription(['amount_yen' => 10000, 'interval_months' => 12]); // monthly: 833, yearly: 10000
        $sub3 = new Subscription(['amount_yen' => 6000, 'interval_months' => 6]); // monthly: 1000, yearly: 12000

        $subscriptions = new Collection([$sub1, $sub2, $sub3]);

        // calculateMonthlyTotal
        $method = new \ReflectionMethod(DashboardService::class, 'calculateMonthlyTotal');
        $method->setAccessible(true);
        $result = $method->invoke($service, $subscriptions);
        // 1000 + 833 + 1000 = 2833
        $this->assertEquals(2833, $result);

        // calculateYearlyTotal
        $method = new \ReflectionMethod(DashboardService::class, 'calculateYearlyTotal');
        $method->setAccessible(true);
        $result = $method->invoke($service, $subscriptions);
        // 12000 + 10000 + 12000 = 34000
        $this->assertEquals(34000, $result);
    }

    public function test_get_subscriptions_by_category()
    {
        $service = new DashboardService();

        $sub1 = new Subscription([
            'category' => '動画',
            'amount_yen' => 1000,
            'interval_months' => 1
        ]); // Video A: m=1000, y=12000
        $sub2 = new Subscription([
            'category' => '動画',
            'amount_yen' => 2000,
            'interval_months' => 1
        ]); // Video B: m=2000, y=24000
        $sub3 = new Subscription([
            'category' => '音楽',
            'amount_yen' => 980,
            'interval_months' => 1
        ]); // Music A: m=980, y=11760

        $subscriptions = new Collection([$sub1, $sub2, $sub3]);

        $method = new \ReflectionMethod(DashboardService::class, 'getSubscriptionsByCategory');
        $method->setAccessible(true);
        $result = $method->invoke($service, $subscriptions);

        // 期待される構造:
        // [
        //   ['category' => '動画', 'monthlyTotal' => 3000, 'yearlyTotal' => 36000, 'count' => 2],
        //   ['category' => '音楽', 'monthlyTotal' => 980,  'yearlyTotal' => 11760, 'count' => 1],
        // ]
        // ※ sortByDesc('monthlyTotal') なので 動画(3000) が先に来るはず

        $this->assertCount(2, $result);

        $this->assertEquals('動画', $result[0]['category']);
        $this->assertEquals(3000, $result[0]['monthlyTotal']);
        $this->assertEquals(2, $result[0]['count']);

        $this->assertEquals('音楽', $result[1]['category']);
        $this->assertEquals(980, $result[1]['monthlyTotal']);
        $this->assertEquals(1, $result[1]['count']);
    }
}
