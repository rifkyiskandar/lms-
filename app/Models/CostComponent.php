<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostComponent extends Model
{
    use HasFactory;

    protected $primaryKey = 'cost_component_id';

    protected $fillable = [
        'component_name',
        'component_code',
        'billing_type', // Enum: PER_SKS, PER_COURSE, PER_SEMESTER, ONE_TIME
        'amount'
    ];

    // Relasi ke Tuition Fees (Tarif) - Opsional, untuk validasi hapus nanti
    // public function tuitionFees()
    // {
    //     return $this->hasMany(TuitionFee::class, 'cost_component_id');
    // }
}

