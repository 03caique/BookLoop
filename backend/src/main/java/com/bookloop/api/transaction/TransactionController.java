package com.bookloop.api.transaction;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@AllArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}/confirmar")
    public void confirmDelivery(@PathVariable Long id) {
        transactionService.confirmDelivery(id);
    }

    @GetMapping
    public Page<TransactionResponseDTO> findByUser(@RequestParam Long usuarioId, Pageable pageable) {
        return transactionService.findByUser(usuarioId, pageable);
    }
}