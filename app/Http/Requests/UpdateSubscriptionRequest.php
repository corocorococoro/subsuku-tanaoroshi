<?php

namespace App\Http\Requests;

use App\Models\Subscription;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'amount_yen' => ['required', 'integer', 'min:0', 'max:10000000'],
            'interval_months' => ['required', 'integer', Rule::in(Subscription::INTERVAL_MONTHS)],
            'started_on' => ['required', 'date'],
            'next_billing_on' => ['nullable', 'date'],
            'category' => ['required', 'string', Rule::in(Subscription::CATEGORIES)],
            'memo' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['active', 'canceled'])],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'サービス名',
            'amount_yen' => '金額',
            'interval_months' => '支払い周期',
            'started_on' => '開始日',
            'next_billing_on' => '次回請求日',
            'category' => 'カテゴリ',
            'memo' => 'メモ',
            'status' => 'ステータス',
        ];
    }
}
