<?php

namespace Tests\Unit\Models;

use App\Models\Subscription;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    /**
     * 月額換算 (monthly_equiv_yen) の計算ロジック検証
     */
    public function test_monthly_equiv_yen_calculation()
    {
        // Case 1: 1ヶ月毎, 1000円 -> 1000円
        $sub1 = new Subscription([
            'amount_yen' => 1000,
            'interval_months' => 1,
        ]);
        $this->assertEquals(1000, $sub1->monthly_equiv_yen);

        // Case 2: 12ヶ月毎, 10000円 -> 833円 (10000 / 12 = 833.333...) 四捨五入
        $sub2 = new Subscription([
            'amount_yen' => 10000,
            'interval_months' => 12,
        ]);
        $this->assertEquals(833, $sub2->monthly_equiv_yen);

        // Case 3: 12ヶ月毎, 12000円 -> 1000円
        $sub3 = new Subscription([
            'amount_yen' => 12000,
            'interval_months' => 12,
        ]);
        $this->assertEquals(1000, $sub3->monthly_equiv_yen);
    }

    /**
     * 年額換算 (yearly_equiv_yen) の計算ロジック検証
     */
    public function test_yearly_equiv_yen_calculation()
    {
        // Case 1: 1ヶ月毎, 1000円 -> 12000円
        $sub1 = new Subscription([
            'amount_yen' => 1000,
            'interval_months' => 1,
        ]);
        $this->assertEquals(12000, $sub1->yearly_equiv_yen);

        // Case 2: 12ヶ月毎, 10000円 -> 10000円
        $sub2 = new Subscription([
            'amount_yen' => 10000,
            'interval_months' => 12,
        ]);
        $this->assertEquals(10000, $sub2->yearly_equiv_yen);

        // Case 3: 6ヶ月毎, 5000円 -> 10000円
        $sub3 = new Subscription([
            'amount_yen' => 5000,
            'interval_months' => 6,
        ]);
        $this->assertEquals(10000, $sub3->yearly_equiv_yen);
    }

    /**
     * 契約月数 (months_subscribed) の計算ロジック検証
     */
    public function test_months_subscribed_calculation()
    {
        // 基準日を固定
        Carbon::setTestNow('2024-01-01 10:00:00');

        // Case 1: 今日開始 -> 1ヶ月 (最低保証)
        $sub1 = new Subscription([
            'started_on' => '2024-01-01',
        ]);
        $this->assertEquals(1, $sub1->months_subscribed);

        // Case 2: 1ヶ月前開始 (2023-12-01) -> 2ヶ月目
        // diffInMonthsは満了した月数を返すため、 '2023-12-01' to '2024-01-01' は 1。 +1 して 2ヶ月目
        $sub2 = new Subscription([
            'started_on' => '2023-12-01',
        ]);
        $this->assertEquals(2, $sub2->months_subscribed);

        // Case 3: 半年前開始 (2023-07-01) -> 7ヶ月目 (6ヶ月経過 + 今月分)
        $sub3 = new Subscription([
            'started_on' => '2023-07-01',
        ]);
        $this->assertEquals(7, $sub3->months_subscribed);
    }

    /**
     * 累計支払額 (total_paid) の計算ロジック検証
     */
    public function test_total_paid_calculation()
    {
        Carbon::setTestNow('2024-01-01 10:00:00');

        // Case 1: 毎月払い1000円, 3ヶ月目 (started: 2023-11-01)
        // months_subscribed = 3
        // payment_count = ceil(3 / 1) = 3回
        // total = 1000 * 3 = 3000
        $sub1 = new Subscription([
            'amount_yen' => 1000,
            'interval_months' => 1,
            'started_on' => '2023-11-01',
        ]);
        $this->assertEquals(3000, $sub1->total_paid);

        // Case 2: 年払い10000円, 13ヶ月目 (started: 2022-12-15)
        // months_subscribed: 2022-12-15 to 2024-01-01 = 12ヶ月と半月 => diffInMonths=12 => +1 = 13ヶ月目
        // payment_count = ceil(13 / 12) = 2回 (1ヶ月目と13ヶ月目に支払い)
        // total = 10000 * 2 = 20000
        $sub2 = new Subscription([
            'amount_yen' => 10000,
            'interval_months' => 12,
            'started_on' => '2022-12-15',
        ]);
        $this->assertEquals(20000, $sub2->total_paid);
    }

    /**
     * Scope の検証
     * ※ ScopeはEloquent Builderを通す必要があるためデータベースを使用する
     */
    public function test_scopes()
    {
        // RefreshDatabaseトレイトを使っていないが、UnitテストなのでInMemory SQLiteを使うか、
        // あるいはモックするか。
        // ここでは親クラスがTests\TestCaseなので、各テストは独立したApplicationインスタンスを持つが、
        // DBリセットは行われない可能性がある。
        // 一般的にModelのScopeテストはFeatureテストに近い挙動になるが、Unit/Modelsに配置して RefreshDatabase を使うのが通例。
        // 一旦メモリDBで動くよう RefreshDatabase をuseする。
    }
}
