import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import Transaction


def export_transactions_csv(modeladmin, request, queryset):
    response = HttpResponse(
        content_type="text/csv"
    )
    response["Content-Disposition"] = (
        'attachment; filename="transactions.csv"'
    )

    writer = csv.writer(response)

    writer.writerow([
        "ID",
        "Transaction ID",
        "User",
        "Card",
        "Amount",
        "Status",
        "Created At",
    ])

    for transaction in queryset:
        writer.writerow([
            transaction.id,
            transaction.transaction_id,
            transaction.user.username,
            transaction.card.last_four_digits,
            transaction.amount,
            transaction.status,
            transaction.created_at,
        ])

    return response


export_transactions_csv.short_description = "Export selected transactions to CSV"


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "transaction_id",
        "user",
        "card",
        "amount",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "transaction_id",
        "user__username",
    )

    ordering = ("-created_at",)

    actions = [
        export_transactions_csv
    ]