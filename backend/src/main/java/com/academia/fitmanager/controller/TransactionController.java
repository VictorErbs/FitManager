package com.academia.fitmanager.controller;

import com.academia.fitmanager.model.Transaction;
import com.academia.fitmanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    @PostConstruct
    public void initData() {
        if (transactionRepository.count() == 0) {
            LocalDate today = LocalDate.now();
            int year = today.getYear();

            // Seed realistic monthly data for the whole year
            String[] months = {"Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"};
            double[] incomes  = {3800, 4100, 4500, 4200, 5100, 4900, 5300, 5800, 5500, 6000, 5700, 6200};
            double[] expenses = {2100, 2300, 2400, 2200, 2700, 2600, 2800, 3000, 2900, 3100, 2900, 3200};

            for (int m = 1; m <= 12; m++) {
                LocalDate date = LocalDate.of(year, m, 15);
                if (!date.isAfter(today)) {
                    transactionRepository.save(new Transaction(
                        "Receitas - " + months[m-1], incomes[m-1], "INCOME", date, "Mensalidade"));
                    transactionRepository.save(new Transaction(
                        "Despesas - " + months[m-1], expenses[m-1], "EXPENSE", date, "Folha de Pagamento"));
                }
            }
            // Extra individual transactions for current month
            transactionRepository.save(new Transaction("Mensalidade - João Alves",  150.00, "INCOME",  today.minusDays(1), "Mensalidade"));
            transactionRepository.save(new Transaction("Mensalidade - Maria Costa", 150.00, "INCOME",  today.minusDays(2), "Mensalidade"));
            transactionRepository.save(new Transaction("Mensalidade - Ana Silva",   150.00, "INCOME",  today.minusDays(3), "Mensalidade"));
            transactionRepository.save(new Transaction("Conta de Luz",              350.00, "EXPENSE", today.minusDays(8), "Despesas Fixas"));
            transactionRepository.save(new Transaction("Manutenção Equipamentos",   200.00, "EXPENSE", today.minusDays(10), "Manutenção"));
            System.out.println("✅ Transactions seeded with monthly data!");
        }
    }

    // GET /api/transactions
    @GetMapping
    public List<Transaction> getAll() {
        return transactionRepository.findAllByOrderByDateDescIdDesc();
    }

    // GET /api/transactions/summary
    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        double income  = transactionRepository.sumIncome();
        double expense = transactionRepository.sumExpense();
        return Map.of(
            "totalIncome",  income,
            "totalExpense", expense,
            "balance",      income - expense
        );
    }

    // GET /api/transactions/monthly
    // Returns 12-element arrays of income and expense per month for the current year
    @GetMapping("/monthly")
    public Map<String, Object> getMonthly() {
        int year = LocalDate.now().getYear();
        List<Transaction> all = transactionRepository.findAllByOrderByDateDescIdDesc();

        double[] income  = new double[12];
        double[] expense = new double[12];

        for (Transaction t : all) {
            if (t.getDate() != null && t.getDate().getYear() == year) {
                int idx = t.getDate().getMonthValue() - 1;
                if ("INCOME".equals(t.getType()))  income[idx]  += t.getAmount();
                if ("EXPENSE".equals(t.getType())) expense[idx] += t.getAmount();
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("labels",  new String[]{"Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"});
        result.put("income",  income);
        result.put("expense", expense);
        return result;
    }

    // POST /api/transactions
    @PostMapping
    public Transaction create(@RequestBody Transaction t) {
        if (t.getDate() == null) t.setDate(LocalDate.now());
        return transactionRepository.save(t);
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transactionRepository.deleteById(id);
    }
}
