import { AccountsOverview } from "@/components/accounts-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { QuickActions } from "@/components/quick-actions"
import { FinancialChart } from "@/components/financial-chart"
import { BudgetTracker } from "@/components/budget-tracker"
import { SavingsGoals } from "@/components/savings-goals"
import { QuickBillPay } from "@/components/quick-bill-pay"
import { BusinessMetrics } from "@/components/business-metrics"

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AccountsOverview />
          <FinancialChart />
          <RecentTransactions />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <BudgetTracker />
          <SavingsGoals />
          <QuickBillPay />
          <BusinessMetrics />
        </div>
      </div>
    </div>
  )
}
