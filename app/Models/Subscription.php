<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Subscription extends Model
{
    public const CATEGORIES = [
        '動画',
        '音楽',
        '仕事',
        '学習',
        'ゲーム',
        'クラウド/IT',
        '生活',
        '恋愛/マッチング',
        'フィットネス/健康',
        'ニュース/情報',
        '推し活/ファンクラブ',
        '飲食/グルメ',
        'ショッピング',
        'その他',
    ];

    public const INTERVAL_MONTHS = [1, 2, 3, 4, 6, 12];

    protected $fillable = [
        'user_id',
        'name',
        'amount_yen',
        'interval_months',
        'started_on',
        'next_billing_on',
        'category',
        'memo',
        'status',
    ];

    protected $casts = [
        'amount_yen' => 'integer',
        'interval_months' => 'integer',
        'started_on' => 'date',
        'next_billing_on' => 'date',
    ];

    protected $appends = ['monthly_equiv_yen', 'yearly_equiv_yen', 'total_paid', 'months_subscribed'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 月額換算（整数円）
     */
    protected function monthlyEquivYen(): Attribute
    {
        return Attribute::make(
            get: fn() => (int) round($this->amount_yen / $this->interval_months),
        );
    }

    /**
     * 年額換算（整数円）
     * interval_monthsは12の約数なので割り切れる
     */
    protected function yearlyEquivYen(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->amount_yen * (12 / $this->interval_months),
        );
    }

    /**
     * 契約してからの月数
     */
    protected function monthsSubscribed(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->started_on) {
                    return 0;
                }
                $start = $this->started_on;
                $now = now();

                // 開始日から現在までの月数を計算
                $months = (int) $start->diffInMonths($now);

                // 最低1ヶ月（開始月は含む）
                return max(1, $months + 1);
            },
        );
    }

    /**
     * これまでの累計支払額（整数円）
     * 契約月数から支払い回数を計算し、amount_yenを掛ける
     */
    protected function totalPaid(): Attribute
    {
        return Attribute::make(
            get: function () {
                $months = $this->months_subscribed;
                // 支払い回数 = 契約月数 / 支払い間隔（切り上げ）
                $paymentCount = (int) ceil($months / $this->interval_months);
                return $this->amount_yen * $paymentCount;
            },
        );
    }

    /**
     * アクティブなサブスクのみ取得するスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * キャンセル済みのサブスクのみ取得するスコープ
     */
    public function scopeCanceled($query)
    {
        return $query->where('status', 'canceled');
    }
}
